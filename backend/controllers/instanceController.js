const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS Region
AWS.config.update({ region: 'ap-south-1' }); // Changing region to mumbai

// Create an EC2 service object
const ec2 = new AWS.EC2();

//object for instance details
let instanceDetails = {
  instanceId: "",
  ipAddress: ""
}


//helper for creating instance
const createInstance = async () => {

  const userDataScript = fs.readFileSync('scripts/instanceBS.sh', 'utf-8');
  const userDataBase64 = Buffer.from(userDataScript).toString('base64');

  const params = {
    ImageId: 'ami-09b0a86a2c84101e1', // Replace with your AMI ID ( here ubuntu is used )
    InstanceType: 't2.micro', // Change instance type as needed
    MinCount: 1,
    MaxCount: 1,
    KeyName: 'judge0ServerKey2', // Replace with your key pair name
    UserData: userDataBase64,
    SecurityGroupIds: ['sg-0dec46615f73eade6'], // Replace with your security group ID
    // SubnetId: 'subnet-xxxxxxxx', // Replace with your subnet ID
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/sda1',  // The device name for the root volume
        Ebs: {
          VolumeSize: 25,         // Size of the volume in GB
          VolumeType: 'gp3',      // General purpose SSD volume type (you can use 'gp3', 'io1', etc.)
          DeleteOnTermination: true // Automatically delete the volume when the instance is terminated
        }
      }
    ],
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: 'MyEC2Instance', // Change the instance name as needed
          },
        ],
      },
    ],
  };

  try {
    const data = await ec2.runInstances(params).promise();
    console.log('Instance Created:', data.Instances[0].InstanceId);
    return data.Instances[0].InstanceId;
  } catch (error) {
    console.error('Error creating instance:', error);
    throw error;
  }
};

//helper for terminating instance
const deleteInstance = async (instanceId) => {
  const params = {
    InstanceIds: [instanceId],
  };

  try {
    const data = await ec2.terminateInstances(params).promise();
    console.log('Instance Terminated:', instanceId);
    return data.TerminatingInstances;
  } catch (error) {
    console.error('Error terminating instance:', error);
    throw error;
  }
};

//creating instance
const create = async (req, res) => {

  // Create an EC2 instance
  try {
    console.log('Creating EC2 instance...');
    instanceDetails.instanceId = await createInstance();
    const data = await ec2.describeInstances({
      InstanceIds: [instanceDetails.instanceId], // Replace with your instance ID
    }).promise();

    // Extract public IP
    instanceDetails.ipAddress = data.Reservations[0].Instances[0].PublicIpAddress;
    console.log('Public IP:', instanceDetails.ipAddress);
    res.status(200).json({ message: "successfully insatance created" })
  }
  catch (error) {
    res.status(400).json({ error });
  }

}

//terminating instance
const deleteIns = async (req,res) => {
  try {
    console.log("deleting ec2 instaces...");
    await deleteInstance(instanceDetails.instanceId);
    res.status(200).json({ message: "instance deleted succesfully" });
  }
  catch (error) {
    res.status(400).json({ error });
  }

}

module.exports = { create, deleteIns, instanceDetails }
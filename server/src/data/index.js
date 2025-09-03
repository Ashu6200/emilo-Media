const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models');
const PricingModel = require('../models/pricingModel');

const password = '123456';

async function createData() {
  const userIds = Array.from(
    { length: 4 },
    () => new mongoose.Types.ObjectId()
  );
  const pricingsIds = Array.from(
    { length: 10 },
    () => new mongoose.Types.ObjectId()
  );

  const users = [
    {
      _id: userIds[0],
      fullName: 'Admin User',
      username: 'admin123',
      email: 'admin@gmail.com',
      password: await bcrypt.hash(password, 10),
      profilePicture: {
        type: 'image',
        url: 'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
        publicId: 'v1680950166',
        thumbnail:
          'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
      },
      bio: `Dedicated app admin ensuring smooth operations, user safety, compliance, and system efficiency with strong leadership and technical expertise.`,
      isPrivate: false,
      role: 'admin',
      followers: [],
      following: [],
      createdAt: new Date('2024-01-07T06:19:22.000Z'),
      updatedAt: new Date('2024-01-07T06:19:22.000Z'),
    },
    {
      _id: userIds[1],
      fullName: 'Manager',
      username: 'manager123',
      email: 'manager@example.com',
      password: await bcrypt.hash(password, 10),
      profilePicture: {
        type: 'image',
        url: 'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
        publicId: 'v1680950166',
        thumbnail:
          'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
      },
      bio: 'Strategic manager driving growth, team collaboration, and engagement on the platform while aligning business goals with innovative solutions.',
      isPrivate: false,
      role: 'manager',
      followers: [],
      following: [],
      createdAt: new Date('2024-02-10T10:00:00.000Z'),
      updatedAt: new Date('2024-02-10T10:00:00.000Z'),
    },
    {
      _id: userIds[2],
      fullName: 'Accountant',
      username: 'accountant123',
      email: 'accountant@example.com',
      password: await bcrypt.hash(password, 10),
      profilePicture: {
        type: 'image',
        url: 'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
        publicId: 'v1680950166',
        thumbnail:
          'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950166/samples/cloudinary-group.jpg',
      },
      bio: 'Detail-oriented accountant managing budgets, financial records, and compliance, ensuring transparency and accuracy for sustainable app growth.',
      isPrivate: true,
      role: 'accountant',
      followers: [],
      following: [],
      createdAt: new Date('2024-03-15T08:30:00.000Z'),
      updatedAt: new Date('2024-03-15T08:30:00.000Z'),
    },
    {
      _id: userIds[3],
      fullName: 'Emily Clark',
      username: 'emilyc',
      email: 'emilyc@example.com',
      password: await bcrypt.hash(password, 10),
      profilePicture: {
        type: 'image',
        url: 'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950160/samples/bike.jpg',
        publicId: 'v1680950160',
        thumbnail:
          'https://res.cloudinary.com/dzvwtdvdl/image/upload/v1680950160/samples/bike.jpg',
      },
      bio: 'Active community member sharing ideas, connecting with friends, exploring trends, and engaging meaningfully while respecting platform values.',
      isPrivate: false,
      role: 'user',
      followers: [],
      following: [],
      createdAt: new Date('2024-04-01T12:00:00.000Z'),
      updatedAt: new Date('2024-04-01T12:00:00.000Z'),
    },
  ];
  const pricings = [
    {
      _id: pricingsIds[0],
      city: 'Raipur',
      pricePerView: 10,
      pricePerLike: 5,
    },
    {
      _id: pricingsIds[1],
      city: 'Delhi',
      pricePerView: 15,
      pricePerLike: 8,
    },
    {
      _id: pricingsIds[2],
      city: 'Mumbai',
      pricePerView: 12,
      pricePerLike: 6,
    },
    {
      _id: pricingsIds[3],
      city: 'Bangalore',
      pricePerView: 18,
      pricePerLike: 9,
    },
    {
      _id: pricingsIds[4],
      city: 'Chennai',
      pricePerView: 11,
      pricePerLike: 5,
    },
    {
      _id: pricingsIds[5],
      city: 'Kolkata',
      pricePerView: 14,
      pricePerLike: 7,
    },
    {
      _id: pricingsIds[6],
      city: 'Hyderabad',
      pricePerView: 16,
      pricePerLike: 8,
    },
    {
      _id: pricingsIds[7],
      city: 'Pune',
      pricePerView: 13,
      pricePerLike: 6,
    },
    {
      _id: pricingsIds[8],
      city: 'Ahmedabad',
      pricePerView: 10,
      pricePerLike: 5,
    },
    {
      _id: pricingsIds[9],
      city: 'Jaipur',
      pricePerView: 9,
      pricePerLike: 4,
    },
  ];
  try {
    await UserModel.insertMany(users);
    await PricingModel.insertMany(pricings);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

module.exports = createData;

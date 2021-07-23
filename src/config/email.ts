export const emailConfig = {
  smtp: {
    // host: 'smtp.gmail.com',
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ashleigh.labadie@ethereal.email',
      pass: '6WQPUYBU9ZJKbVvPbc',
    },
  },
  from: process.env.EMAIL_FROM || 'thanos@gmail.com',
};

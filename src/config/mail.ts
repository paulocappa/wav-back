interface IMailConfig {
  driver: 'ethereal';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'Waving.app',
      email: 'contato@waving.app',
    },
  },
} as IMailConfig;

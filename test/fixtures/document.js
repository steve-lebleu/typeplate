exports.image = (owner) => {
  return {
    fieldname: 'image',
    filename: 'javascript.jpg',
    path: process.cwd() + '/dist/images/master-copy/javascript.jpg',
    mimetype: 'image/jpeg',
    size: '',
    owner: owner.id
  }
};

exports.document = (owner) => {
  return {
    fieldname: 'document',
    filename: 'invoice.pdf',
    path: process.cwd() + '/dist/documents/invoice.jpg',
    mimetype: 'image/jpeg',
    size: '',
    owner: owner.id
  }
};

exports.archive = (owner) => {
  return {
    fieldname: 'image',
    filename: 'javascript.jpg',
    path: process.cwd() + '/dist/images/master-copy/javascript.jpg',
    mimetype: 'image/jpeg',
    size: '',
    owner: owner.id
  }
};
exports.image = (owner) => {
  return {
    fieldname: 'image',
    filename: 'javascript.jpg',
    path: process.cwd() + '/dist/public/images/master-copy/javascript.jpg',
    mimetype: 'image/jpeg',
    size: '',
    owner: owner.id
  }
};

exports.document = (owner) => {
  return {
    fieldname: 'document',
    filename: 'invoice.pdf',
    path: process.cwd() + '/dist/public/documents/invoice.jpg',
    mimetype: 'application/pdf',
    size: '',
    owner: owner.id
  }
};

exports.archive = (owner) => {
  return {
    fieldname: 'archive',
    filename: 'Documents.rar',
    path: process.cwd() + '/dist/public/archives/Documents.rar',
    mimetype: 'archive/rar',
    size: '',
    owner: owner.id
  }
};
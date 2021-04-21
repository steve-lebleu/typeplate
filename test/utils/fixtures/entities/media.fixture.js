const { UPLOAD } =  require(process.cwd() + '/dist/api/config/environment.config');

exports.image = (owner) => {
  return {
    fieldname: 'banner',
    filename: 'javascript.jpg',
    path: UPLOAD.PATH + '/images/master-copy/banner/javascript.jpg',
    mimetype: 'image/jpeg',
    size: '',
    owner: owner.id
  }
};

exports.document = (owner) => {
  return {
    fieldname: 'document',
    filename: 'invoice.pdf',
    path: UPLOAD.PATH + '/documents/invoice.jpg',
    mimetype: 'application/pdf',
    size: '',
    owner: owner.id
  }
};

exports.archive = (owner) => {
  return {
    fieldname: 'archive',
    filename: 'documents.rar',
    path: UPLOAD.PATH + '/archives/documents.rar',
    mimetype: 'archive/rar',
    size: '',
    owner: owner.id
  }
};
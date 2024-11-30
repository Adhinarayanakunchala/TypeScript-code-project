import * as yup from 'yup';

const schema = yup.object().shape({
  patientName: yup.string().required('Patient name is required'),
  hospitalName: yup.string().required('Hospital name is required'),
  patientBloodGroup: yup.string().required('Blood group is required'),
  rhesus: yup.string().required('Rhesus is required'),
  details: yup.array().of(
    yup.object().shape({
      bagNo: yup.string().required('Bag No. is required'),
      aboGroup: yup.string().required('ABO Group is required'),
      rhesus: yup.string().required('Rhesus is required'),
      compatibility: yup.string().required('Compatibility is required'),
      issuedTime: yup.string().required('Issued Time is required'),
      collectionDate: yup.date().required('Date of Collection is required'),
      expiryDate: yup.date().required('Date of Expiry is required'),
      testingDate: yup.date().required('Date of Testing is required'),
      segmentNo: yup.string().required('Segment No. is required')
    })
  ).required()
});

export default schema;

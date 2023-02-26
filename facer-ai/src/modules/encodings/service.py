import face_recognition as fr
from src.modules.encodings.schema import EncodingsDocument, FaceEncodingError

def encodeDLIB(rgbImage, box, label: str):
  encodings = fr.face_encodings(rgbImage, box)
  if (len(encodings) == 0):
    raise FaceEncodingError()
  else:
    newEncodings = EncodingsDocument(**{
      'label': label,
      'model': 'dlib',
      'encodings': list(encodings[0])
    })
    newEncodings.save()
    return { 'message': 'Encodings saved'}
  
from tensorflow.keras.applications import Xception
from tensorflow.keras import layers, metrics
import tensorflow as tf
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.optimizers import Adam
import os
import cv2
import numpy as np

TARGET = (224, 224, 3)

class SiameseModel(Model):
    def __init__(self, siameseNet, margin=1.0):
        super(SiameseModel, self).__init__()
        
        self.margin = margin
        self.siameseNet = siameseNet
        self.loss_tracker = metrics.Mean(name = 'loss')
        
    def call(self, inputs):
        return self.siameseNet(inputs)
    
    def train_step(self, data):
        with tf.GradientTape() as tape:
            loss = self._compute_loss(data)
        
        gradients = tape.gradient(loss, self.siameseNet.trainable_weights)
        self.optimizer.apply_gradients(zip(gradients, self.siameseNet.trainable_weights))
        
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}

    def test_step(self, data):
        loss = self._compute_loss(data)
        
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}

    def _compute_loss(self, data):
        # Get the two distances from the network, then compute the triplet loss
        ap_distance, an_distance = self.siameseNet(data)
        loss = tf.maximum(ap_distance - an_distance + self.margin, 0.0)
        return loss
        
    def _x(self):
        self.pred


    @property
    def metrics(self):
        # We need to list our metrics so the reset_states() can be called automatically.
        return [self.loss_tracker]

class DistanceLayer(layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def call(self, anchor, positive, negative):
        ap_distance = tf.reduce_sum(tf.square(anchor - positive), -1)
        an_distance = tf.reduce_sum(tf.square(anchor - negative), -1)
        return (ap_distance, an_distance)

def getEncoder(inputShape):
    pretrained = Xception(
    input_shape=inputShape, weights='imagenet', include_top=False, pooling='avg')
    for i in range(len(pretrained.layers) - 27):
        pretrained.layers[i].trainable = False
        
    encoder = Sequential([
        pretrained,
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Lambda(lambda x: tf.math.l2_normalize(x, axis=1))
    ], name ='encoder')
    return encoder

def getSiameseNet(inputShape = (224, 224, 3)):
    encoder = getEncoder(inputShape)
    anc = layers.Input(inputShape, name='anchor')
    pos = layers.Input(inputShape, name='positive')
    neg = layers.Input(inputShape, name='negative')
        
    ancEnc = encoder(anc)
    posEnc = encoder(pos)
    negEnc = encoder(neg)
        
    distances = DistanceLayer()(ancEnc, posEnc, negEnc)
    
    siameseNet = Model(inputs = [anc, pos, neg], outputs = distances, name='siamese_net')
    return siameseNet
    

def processImg(name, dirPath = 'images', imgExt = 'jpg', subDirPath = None):
    fullImgName = '.'.join([name, imgExt])
    imgPath = os.path.join(dirPath, fullImgName) if subDirPath == None else os.path.join(dirPath, subDirPath, fullImgName)
    raw = cv2.imread(imgPath)
    img = cv2.cvtColor(raw, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img, (224, 224))
    return resized

def predict(im1, im2, encoder):
    t1 = encoder.predict(np.asarray([im1]))
    t2 = encoder.predict(np.asarray([im2]))
    return np.sum(np.square(t1-t2), axis=-1)[0]

def extract_encoder(model):
    encoder = getEncoder(TARGET)
    i=0
    for e_layer in model.layers[0].layers[3].layers:
        layer_weight = e_layer.get_weights()
        encoder.layers[i].set_weights(layer_weight)
        i+=1
    return encoder


def get_encoder(weight_path = './weights.h5'):
  smNet = getSiameseNet(TARGET)
  model = SiameseModel(smNet)
  optimizer = Adam(learning_rate=1e-3, epsilon=1e-01)
  model.compile(optimizer=optimizer)
  model.build([(None, 224, 224, 3), (None, 224, 224, 3), (None, 224, 224, 3)])
  model.load_weights('./weights.h5')

  encoder = extract_encoder(model)
  return encoder

# im1 = processImg('Adam_Sandler_0001', 'lfw', subDirPath='Adam_Sandler')
# im2 = processImg('Adam_Sandler_0002', 'lfw', subDirPath='Adam_Sandler')

# encoder = extract_encoder(model)

# eval = predict(im1, im2, encoder)
# print(eval)


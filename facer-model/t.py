import tensorflow as tf

print(tf.__version__) # 2.6.4
# import  matplotlib.pyplot as plt 

# history = {'loss': [0.8561912775039673, 0.83, 0.8, 0.75, 0.7, 0.6, 0.4, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], 
#            'val_loss': [0.7958878874778748, 0.43, 0.4, 0.45, 0.47, 0.46, 0.44, 0.32, 0.31, 0.31, 0.31, 0.21, 0.31, 0.31], 'lr': [0.001]}

# loss = history['loss']
# val_loss = history['val_loss']

# epochs = range(len(loss))
# plt.figure(figsize=(20, 10), dpi=100)
# plt.plot(epochs, loss,'r', label='Loss')
# plt.plot(epochs, val_loss,'b', label='Val loss')
# plt.xlabel('Epochs')
# plt.ylabel('Loss value')
# plt.legend()
# plt.show()
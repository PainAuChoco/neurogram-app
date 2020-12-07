import torch
from torch import nn
import torchvision.utils as vutils
from torchvision import transforms
import torch.nn.functional as F
import os, sys
import numpy as np
import errno
import requests
import base64
from io import BytesIO

class Generator(nn.Module):

    def __init__(self, input_dim=10, im_chan=3, hidden_dim=64):
        super(Generator, self).__init__()
        self.input_dim = input_dim
        # Build the neural network
        self.gen = nn.Sequential(
            # input is Z, going into a convolution
            nn.ConvTranspose2d( self.input_dim, hidden_dim * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(hidden_dim * 8),
            nn.ReLU(True),
            # state size. (hidden_dim*8) x 4 x 4
            nn.ConvTranspose2d(hidden_dim * 8, hidden_dim * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(hidden_dim * 4),
            nn.ReLU(True),
            # state size. (hidden_dim*4) x 8 x 8
            nn.ConvTranspose2d( hidden_dim * 4, hidden_dim * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(hidden_dim * 2),
            nn.ReLU(True),
            # state size. (hidden_dim*2) x 16 x 16
            nn.ConvTranspose2d( hidden_dim * 2, hidden_dim, 4, 2, 1, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU(True),
            # state size. (hidden_dim) x 32 x 32
            nn.ConvTranspose2d( hidden_dim, im_chan, 4, 2, 1, bias=False),
            nn.Tanh()
            # state size. (im_chan) x 64 x 64
        )

    def forward(self, noise):

        x = noise.view(len(noise), self.input_dim, 1, 1)
        return self.gen(x)

# helper function to un-normalize and display an image
def imshow(img, label, label_classes, save=False, epoch="", batch=""):
    img = img / 2 + 0.5  # unnormalize
    plt.title(str(label_classes[int(label)]))
    plt.imshow(np.transpose(img, (1, 2, 0)))  # convert from Tensor image
    if save:
      plt.savefig('./images/fake.png')

def make_gif():
    fp_in = "./animation/img/fake_*"
    fp_out = "./animation/animation.gif"
    img, *imgs = [Image.open(f) for f in sorted(glob.glob(fp_in), key=os.path.getmtime)]
    img.save(fp=fp_out, format='GIF', append_images=imgs, save_all=True)
    print(fp_out)

def get_one_hot_labels(labels, n_classes):
    return F.one_hot(labels, num_classes=n_classes)

def get_one_hot_labels_from_str(num_img_to_gen ,str, label_classes):
  label_index = label_classes.index(str)
  labels = torch.full((num_img_to_gen,), label_index, dtype=torch.float16)
  return get_one_hot_labels(labels.to(torch.int64), len(label_classes))

def get_noise(n_samples, input_dim, device):
    return torch.randn(n_samples, input_dim, device=device)

def combine_vectors(x, y):
    return torch.cat((x, y), 1).float()

def get_dir_gen_w(category):
    return f'./weights/{category}/netG_{category}_64.weight'

def generate(selected_emotion, selected_style, nb_img, id):
    z_dim = 100
    device = 'cpu'
    label_classes = ['negative', 'neutral', 'positive']
    style_classes = ['portrait', 'landscape', 'abstract', "flower-painting"]
    n_classes = len(label_classes)
    num_img_to_gen = int(nb_img)

    emotion = selected_emotion

    #download_file_from_google_drive(style)

    gen = Generator(input_dim = z_dim + len(label_classes)).to(device)
    model_path = f"./weights/{selected_style}/netG_{selected_style}_64.weight"
    gen.load_state_dict(torch.load(model_path, map_location=torch.device(device)))

    label_index = label_classes.index(emotion)
    one_hot_labels = get_one_hot_labels_from_str(num_img_to_gen, emotion, label_classes).to(device)
    noise = get_noise(num_img_to_gen, z_dim, device=device).to(device)
    noise_and_labels = combine_vectors(noise, one_hot_labels.float())

    fake = gen(noise_and_labels).data.cpu()

    #vutils.save_image(fake.data, f'./react-ui/public/' + id + '.png' , normalize=True)
    t = vutils.make_grid(fake.data, normalize=True)
    img = transforms.ToPILImage()(t)
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    print(img_str)
    

def download_file_from_google_drive(style):

    try:
        os.mkdir(f"./weights/")
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise
        pass

    try:
        os.mkdir(f"./weights/{style}/")
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise
        pass

    id = "1Hd3NRmyjVDZLMkmgmLkJwqyik-l-NNPJ"
    if style == "portrait":
        id = "1Hd3NRmyjVDZLMkmgmLkJwqyik-l-NNPJ"
    elif style == "abstract":
        id = "1JJnZX2LEOdPGGnUvD8e9fqCgTg022229"
    elif style == "landscape":
        id = "1R4tNVTC51FFE5e93FvhBwDARMH8ICAUz"
    elif style == "flower-painting":
        id = "1Ic5-DBb1WsLJ-d3Sl0nZ7txdeuvl6hJC"

    destination = f"./weights/{style}/netG_{style}_64.weight"

    def get_confirm_token(response):
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                return value
        return None

    def save_response_content(response, destination):
        CHUNK_SIZE = 32768
        with open(destination, "wb") as f:
            for chunk in response.iter_content(CHUNK_SIZE):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)

    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(URL, params = { 'id' : id }, stream = True)
    token = get_confirm_token(response)

    if token:
        params = { 'id' : id, 'confirm' : token }
        response = session.get(URL, params = params, stream = True)

    save_response_content(response, destination)


if __name__ == '__main__':

    num_img_to_gen = int(sys.argv[3])
    emotion = str(sys.argv[2])
    style = str(sys.argv[1])
    id = str(sys.argv[5])
    save = str(sys.argv[4])

    generate(emotion, style, num_img_to_gen, id)
    

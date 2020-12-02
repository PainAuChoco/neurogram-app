import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

install(torch)
install(torchvision)
install(matplotlib)
install(os)
install(random)
install(glob)
install(datetime)
install(numpy)
install(PIL)
install(requests)
install(errno)

import torch
from torch import nn
import torchvision.utils as vutils
import torch.nn.functional as F
import matplotlib.pyplot as plt
import os, random, glob, sys
from datetime import date
import numpy as np
from PIL import Image
import requests
import errno

lob = "saucisse"
print(blob)
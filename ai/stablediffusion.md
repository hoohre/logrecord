## Stable Diffusion

#### 免费在线使用
> https://colab.research.google.com/ 
> 运行code  
```
!pip install --upgrade fastapi==0.90.1
!git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
!git clone https://github.com/yfszzx/stable-diffusion-webui-images-browser /content/stable-diffusion-webui/extensions/stable-diffusion-webui-images-browser
!curl -Lo chilloutmixni.safetensors https://huggingface.co/nolanaatama/chomni/resolve/main/chomni.safetensors
!curl -Lo ulzzang-6500.pt https://huggingface.co/nolanaatama/chomni/resolve/main/ulzzang-6500.pt
!mv "/content/chilloutmixni.safetensors" "/content/stable-diffusion-webui/models/Stable-diffusion"
!mv "/content/ulzzang-6500.pt" "/content/stable-diffusion-webui/embeddings"
%cd /content/stable-diffusion-webui
!COMMANDLINE_ARGS="--share --disable-safe-unpickle --skip-torch-cuda-test --no-half-vae --xformers --reinstall-xformers --enable-insecure-extension-access" REQS_FILE="requirements.txt" python launch.py
```

#### 本地服务器Webui
> [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)  
> clip open_clip  
> xformers FOR GPU  


##### 参考资料
* [Stability AI](https://stability.ai/)
* [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
* [stability-ai/stable-diffusion – Run with an API on Replicate](https://replicate.com/stability-ai/stable-diffusion)
* [stabilityai (Stability AI)](https://huggingface.co/stabilityai)

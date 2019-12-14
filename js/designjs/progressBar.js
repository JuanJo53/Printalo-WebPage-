const progressBar=document.getElementsByClassName('progress-bar')[0]
setInterval(()=>{
    const computerStyle=getComputedStyle(progressBar)
    const width = parseFloat(computerStyle.getPropertyValue("--width")) ||0
    progressBar.style.setProperty('--width',width+0.1);
},5);
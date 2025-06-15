function scrollToTop() {
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function reward() {
    if(document.getElementById('rewards').style.display=='none')
    {
        console.log("change");
        document.getElementById('rewards').style.display = 'block';
        return;
    }
    if(document.getElementById('rewards').style.display == 'block')
    {
        console.log("change");
        document.getElementById('rewards').style.display = 'none';
    }
}
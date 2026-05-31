// const msg: string= "Hello!";
// alert(msg);
const linki: string[]=['public/style-1.css','public/style-2.css','public/style-3.css'];

const menu = document.createElement('div');
menu.style.padding = '20px';
menu.style.background = '#f0f0f0';
menu.style.borderBottom = '1px solid #ccc';
menu.innerText = "Wybierz styl: ";
const css=(url:string):void=> {
    const staryLink = document.querySelector('link[data-dynamic="true"]');
    if (staryLink) staryLink.remove();
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.dynamic="true";
    document.head.appendChild(link);

};

linki.forEach((url,index) => {
    const btn = document.createElement('button');
    btn.style.margin = '0 5px';
    btn.textContent= `Styl ${index+1}`;

    btn.onclick = () => css(url);

    menu.appendChild(btn);
});

document.body.prepend(menu);
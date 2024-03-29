import moment from 'moment';
import 'moment/locale/ru';

moment().locale('ru');

export default class DrawItemContent {
  constructor(url, contentList, notification) {
    this.url = url;
    this.contentList = contentList;
    this.notification = notification;
    this.drawInit = false;
  }

  drawContentWidget(data, init = false) {
    for (const i of data) {
      if (init) {
        this.drawInit = true;
      }
      this.drawContent(i);
    }
  }

  drawContent(item, newMessage = false) {
    const possitionToBottom = (
      this.contentList.scrollHeight - this.contentList.scrollTop - this.contentList.offsetHeight
    );
    if (newMessage && possitionToBottom < 30) {
      this.drawInit = true;
    }
    switch (item.type) {
      case 'chaos':
        this.newBotResponse(item.data, newMessage);
        break;
      case 'text':
        this.newText(item.data, newMessage);
        break;
      case 'link':
        this.newLink(item.data, newMessage);
        break;
      case 'audio':
        this.newAudio(item.data, newMessage);
        break;
      case 'video':
        this.newVideo(item.data, newMessage);
        break;
      case 'image':
        this.newImage(item.data, newMessage);
        break;
      case 'location':
        this.newLocation(item.data, newMessage);
        break;
      case 'notification':
        this.notification.createNotification(item.data, newMessage);
        break;
      default:
        break;
    }
  }

  newBotResponse(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content', 'bot-response');
    li.innerHTML = `<div class="content-message">
                            <div class="info-content">
                                <div class="message-date"></div>
                                <div class="response-chaos">From Chaos</div>
                            </div>
                        </div>`;

    const messageDate = li.querySelector('.message-date');
    messageDate.textContent = moment().format('DD.MM.YYYY HH:mm');

    const contentMessage = li.querySelector('.content-message');

    for (const sentence of data) {
      const message = document.createElement('p');
      message.classList.add('message');
      if (Array.isArray(sentence)) {
        message.innerHTML = `<a class="link" href="tel:${sentence[1]}">${sentence[1]}</a>`;
        message.insertAdjacentText('afterbegin', sentence[0]);
      } else {
        message.textContent = sentence;
      }
      contentMessage.appendChild(message);
    }
    const init = this.drawInit;
    this.addElementToDom(newMessage, li);
    this.funcScroll(init);
  }

  newText(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content');
    li.innerHTML = `<div class="content-message">
                            <div class="message-date"></div>
                        </div>`;
    li.dataset.idPost = data.id;

    const messageDate = li.querySelector('.message-date');
    messageDate.textContent = moment(data.date).format('DD.MM.YYYY HH:mm');
    const contentMessage = li.querySelector('.content-message');

    for (const sentence of data.content.text) {
      const message = document.createElement('p');
      message.classList.add('message');
      message.textContent = sentence;
      contentMessage.appendChild(message);
    }
    const init = this.drawInit;
    this.addElementToDom(newMessage, li);
    this.funcScroll(init);
  }

  newLink(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content');
    li.innerHTML = `<div class="content-message">
                            <div class="message-date">${moment(data.date).format('DD.MM.YYYY HH:mm')}</div>
                            <a class="link"></a>
                        </div>`;
    li.dataset.idPost = data.id;

    const contentMessage = li.querySelector('.link');
    contentMessage.href = data.content.text;
    contentMessage.target = '_blank';
    contentMessage.textContent = this.linkNameValidity(data.content.text);
    this.addElementToDom(newMessage, li);
    const init = this.drawInit;
    this.funcScroll(init);
  }

  newLocation(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content');
    li.innerHTML = `<div class="content-message">
                            <div class="message-date"></div>
                            <div class="message location"></div>
                        </div>`;
    li.dataset.idPost = data.id;

    const messageDate = li.querySelector('.message-date');
    messageDate.textContent = moment(data.date).format('DD.MM.YYYY HH:mm');
    const contentMessage = li.querySelector('.message');
    contentMessage.textContent = `широта: ${data.content.text.latitude}, долгота: ${data.content.text.longitude}`;
    const init = this.drawInit;
    this.addElementToDom(newMessage, li);
    this.funcScroll(init);
  }

  newVideo(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content', 'item__video');
    li.innerHTML = `<div class="content-message">
                            <div class="block-date-download">
                                <div class="message-date">
                                ${moment(data.date).format('DD.MM.YYYY HH:mm')}
                                </div>
                                <div class="download-file">
                                    <a class="download-file__link" download>
                                    </a>
                                </div>
                            </div>
                            <div class="block-content">
                                <video class="message__video" controls></video>
                            </div>
                        </div>`;
    li.dataset.idPost = data.id;
    li.dataset.filename = data.content.link;
    const downloadLink = li.querySelector('.download-file__link');
    downloadLink.href = `${this.url}/${data.content.link}`;
    const messageVideo = li.querySelector('.message__video');
    messageVideo.src = `${this.url}/${data.content.link}`;
    this.addElementToDom(newMessage, li);
    const init = this.drawInit;
    messageVideo.oncanplay = () => this.funcScroll(init);
  }

  newAudio(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content', 'item__audio');
    li.innerHTML = `<div class="content-message">
                            <div class="block-date-download">
                                <div class="message-date">
                                ${moment(data.date).format('DD.MM.YYYY HH:mm')}
                                </div>
                                <div class="download-file">
                                    <a class="download-file__link" download>
                                    </a>
                                </div>
                            </div>
                            <div class="block-content">
                                <audio class="message__audio" controls></audio>
                            </div>
                        </div>`;
    li.dataset.idPost = data.id;
    li.dataset.filename = data.content.link;
    const downloadLink = li.querySelector('.download-file__link');
    downloadLink.href = `${this.url}/${data.content.link}`;
    const messageAudio = li.querySelector('.message__audio');
    messageAudio.src = `${this.url}/${data.content.link}`;
    this.addElementToDom(newMessage, li);
    const init = this.drawInit;
    messageAudio.oncanplay = () => this.funcScroll(init);
  }

  newImage(data, newMessage) {
    const li = document.createElement('li');
    li.classList.add('item-content', 'item__img');
    li.innerHTML = `<div class="content-message">
                            <div class="block-date-download">
                                <div class="message-date">
                                ${moment(data.date).format('DD.MM.YYYY HH:mm')}
                                </div>
                                <div class="download-file">
                                    <a class="download-file__link"></a>
                                </div>
                            </div>
                            <div class="block-content">
                                <img class="message__img" src=""></img>
                            </div>
                        </div>`;
    li.dataset.idPost = data.id;
    li.dataset.filename = data.content.link;
    const downloadLink = li.querySelector('.download-file__link');
    downloadLink.href = `${this.url}/${data.content.link}`;
    downloadLink.download = data.content.link;
    const messageImg = li.querySelector('.message__img');
    messageImg.src = `${this.url}/${data.content.link}`;
    this.addElementToDom(newMessage, li);
    const init = this.drawInit;
    messageImg.onload = () => this.funcScroll(init);
  }

  addElementToDom(value, element) {
    if (value) {
      this.contentList.appendChild(element);
    } else {
      this.contentList.insertAdjacentElement('afterbegin', element);
    }
  }

  funcScroll(init) {
    if (init) {
      this.scrollToBottomAnyWay();
      this.drawInit = false;
    }
  }

  scrollToBottom() {
    const possitionToBottom = (
      this.contentList.scrollHeight - this.contentList.scrollTop - this.contentList.offsetHeight
    );
    if (possitionToBottom < 30) {
      this.contentList.scrollTop = this.contentList.scrollHeight;
    }
  }

  scrollToBottomAnyWay() {
    this.contentList.scrollTop = this.contentList.scrollHeight;
  }

  linkNameValidity(data) {
    const value = data;
    if (value.length < 60) {
      return value;
    }

    return `${value.slice(0, 61)}...`;
  }
}

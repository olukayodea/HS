import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OpenAI } from 'openai';
import { environment } from '../../environments/environment';

interface Message {
  content: string | null;
  from: string; // 'user' or 'bot'
  name: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  username: string = "";

  response!: any | undefined;
  promptText = '';

  showError = "";

  showLogin: boolean = true;
  showTyping: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.showError = "";
    if (this.username.trim() === '') {
      this.showError = "Enter a nickname to continue";
      this.showLogin = true;
      return;
    }

    this.showLogin = false;
  }

  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }
    this.showTyping = true;

    this.messages.push({ content: this.userInput, from: 'user', name: this.username });

    this.promptText = this.userInput;
    this.userInput = '';
    this.scrollToBottom();
    this.invokeGPT();
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;

    } catch(err) { 
      console.log("e no work o" + err);
    }
  }


  async invokeGPT() {
    if (this.promptText.length < 2)
      return;
    try {
      // this is a sample
      
      this.response =undefined;
      let configuration = {apiKey: environment.apiKey, dangerouslyAllowBrowser: true};
      let openai = new OpenAI(configuration);

      let apiResponse =  await openai.chat.completions.create({
        messages: [{ role: 'user', content: this.promptText }],
        model: 'gpt-3.5-turbo',
      });

      this.messages.push({ content: apiResponse.choices[0].message.content, from: 'bot', name:'HeartSpace' });
      this.scrollToBottom();

    } catch (error: any) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    }
    this.showTyping = false;
  }

}

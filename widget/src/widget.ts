class ChatbotWidget {
  private botId: string;
  private config: WidgetConfig;
  private container: HTMLElement;
  private chatContainer: HTMLElement;
  private messagesContainer: HTMLElement;
  private inputContainer: HTMLElement;
  private isOpen: boolean = false;
  private apiUrl: string;

  constructor(botId: string, config: WidgetConfig) {
    this.botId = botId;
    this.config = {
      position: 'bottom-right',
      primaryColor: '#3B82F6',
      fontFamily: 'Inter, sans-serif',
      welcomeMessage: 'Hello! How can I help you today?',
      placeholder: 'Type your message...',
      ...config
    };
    this.apiUrl = config.apiUrl || 'https://api.your-domain.com';
    
    this.init();
  }

  private init() {
    this.createStyles();
    this.createContainer();
    this.bindEvents();
    this.loadBotConfig();
  }

  private createStyles() {
    const styles = `
      .chatbot-widget {
        position: fixed;
        ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        z-index: 10000;
        font-family: ${this.config.fontFamily};
      }

      .chatbot-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${this.config.primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .chatbot-toggle:hover {
        transform: scale(1.1);
      }

      .chatbot-chat {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }

      .chatbot-chat.open {
        display: flex;
      }

      .chatbot-header {
        background: ${this.config.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .chatbot-message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        word-wrap: break-word;
      }

      .chatbot-message.user {
        background: ${this.config.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }

      .chatbot-message.bot {
        background: #f1f5f9;
        color: #334155;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }

      .chatbot-input-container {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
      }

      .chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
      }

      .chatbot-send {
        padding: 12px 16px;
        background: ${this.config.primaryColor};
        color: white;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        font-size: 14px;
      }

      .chatbot-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: #f1f5f9;
        border-radius: 18px;
        align-self: flex-start;
      }

      .chatbot-typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #94a3b8;
        animation: typing 1.4s infinite ease-in-out;
      }

      .chatbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .chatbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      @media (max-width: 480px) {
        .chatbot-chat {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
          bottom: 70px;
          right: 20px;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'chatbot-widget';

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chatbot-toggle';
    toggleButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `;

    // Chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'chatbot-chat';

    // Header
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `
      <div>
        <div style="font-weight: 600;">${this.config.name || 'AI Assistant'}</div>
        <div style="font-size: 12px; opacity: 0.8;">Online</div>
      </div>
      <button id="chatbot-close" style="background: none; border: none; color: white; cursor: pointer;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'chatbot-messages';

    // Input container
    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'chatbot-input-container';
    this.inputContainer.innerHTML = `
      <input type="text" class="chatbot-input" placeholder="${this.config.placeholder}" />
      <button class="chatbot-send">Send</button>
    `;

    // Assemble
    this.chatContainer.appendChild(header);
    this.chatContainer.appendChild(this.messagesContainer);
    this.chatContainer.appendChild(this.inputContainer);

    this.container.appendChild(toggleButton);
    this.container.appendChild(this.chatContainer);

    document.body.appendChild(this.container);

    // Add welcome message
    this.addMessage(this.config.welcomeMessage, 'bot');
  }

  private bindEvents() {
    const toggleButton = this.container.querySelector('.chatbot-toggle') as HTMLButtonElement;
    const closeButton = this.container.querySelector('#chatbot-close') as HTMLButtonElement;
    const input = this.container.querySelector('.chatbot-input') as HTMLInputElement;
    const sendButton = this.container.querySelector('.chatbot-send') as HTMLButtonElement;

    toggleButton.addEventListener('click', () => this.toggle());
    closeButton.addEventListener('click', () => this.close());
    sendButton.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  private toggle() {
    this.isOpen = !this.isOpen;
    this.chatContainer.classList.toggle('open', this.isOpen);
  }

  private close() {
    this.isOpen = false;
    this.chatContainer.classList.remove('open');
  }

  private async sendMessage() {
    const input = this.container.querySelector('.chatbot-input') as HTMLInputElement;
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      // Send to API
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: this.botId,
          message: message,
          conversationId: this.getConversationId(),
        }),
      });

      const data = await response.json();

      // Hide typing indicator
      this.hideTyping();

      // Add bot response
      this.addMessage(data.response, 'bot');

    } catch (error) {
      this.hideTyping();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      console.error('Chat error:', error);
    }
  }

  private addMessage(content: string, role: 'user' | 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    messageDiv.textContent = content;

    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-typing';
    typingDiv.id = 'chatbot-typing';
    typingDiv.innerHTML = `
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
    `;

    this.messagesContainer.appendChild(typingDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private hideTyping() {
    const typingDiv = this.container.querySelector('#chatbot-typing');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  private getConversationId(): string {
    let conversationId = localStorage.getItem(`chatbot-${this.botId}-conversation`);
    if (!conversationId) {
      conversationId = 'conv_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(`chatbot-${this.botId}-conversation`, conversationId);
    }
    return conversationId;
  }

  private async loadBotConfig() {
    try {
      const response = await fetch(`${this.apiUrl}/api/bots/${this.botId}/config`);
      const config = await response.json();
      
      // Update widget with bot-specific config
      if (config.primaryColor) {
        this.updatePrimaryColor(config.primaryColor);
      }
    } catch (error) {
      console.error('Failed to load bot config:', error);
    }
  }

  private updatePrimaryColor(color: string) {
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-widget .chatbot-toggle { background: ${color} !important; }
      .chatbot-widget .chatbot-header { background: ${color} !important; }
      .chatbot-widget .chatbot-message.user { background: ${color} !important; }
      .chatbot-widget .chatbot-send { background: ${color} !important; }
    `;
    document.head.appendChild(style);
  }
}

interface WidgetConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  fontFamily?: string;
  welcomeMessage?: string;
  placeholder?: string;
  name?: string;
  apiUrl?: string;
}

// Global function to initialize widget
(window as any).ChatbotWidget = ChatbotWidget;
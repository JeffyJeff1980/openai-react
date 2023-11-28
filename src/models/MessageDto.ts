export class MessageDto {
  isUser: boolean;
  content: string;

  constructor(isUser: boolean, content: string) {
    this.isUser = isUser;
    this.content = content;
  }
}

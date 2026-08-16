export class Initials {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  get(): string {
    return this.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
}

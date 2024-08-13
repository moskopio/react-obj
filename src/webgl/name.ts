export function prepareName(name: string): string {
  const noPrefix = name[0] === 'u' || name[0] === 'a' ? name.slice(1) : name
  const noUppercase = noPrefix[0].toLowerCase() + noPrefix.slice(1)
  return noUppercase
}

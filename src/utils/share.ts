export async function sharePage(title: string, text: string, url = window.location.href) {
  if (navigator.share) {
    await navigator.share({ title, text, url })
    return 'Link condiviso'
  }

  await navigator.clipboard.writeText(url)
  return 'Link copiato'
}

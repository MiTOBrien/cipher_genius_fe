export const getQuote = async () => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
      headers: {
        'X-Api-Key': '+jHD46PpAp+BTkI/KcFuOw==ywttAVFWVGb9i5v4',
      },
    })
    const data = await response.json()
    return {
      quote: data[0].quote,
      // author: data.author,
    }
  } catch (error) {
    console.error('Error fetching quote:', error)
    return {
      content: 'Failed to fetch quote.',
      // author: '',
    }
  }
}

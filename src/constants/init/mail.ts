// @ts-nocheck
const generateNumberOptions = () => {
  let options = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 80, 100]
  let results = []
  options.map(item => {
    results.push({
      label: item,
      value: item,
    })
  })

  // return [
  //   {
  //     options: results,
  //   },
  // ]
  return results
}

const numberOptions = generateNumberOptions()

export { numberOptions }

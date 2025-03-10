const country_name = document.getElementById("country-name");
const btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  const country = country_name.value;
  getCountryArr(country);
});

async function updateContent(countryArray) {
  const countryInfoC = document.getElementById("country-info");
  countryInfoC.innerHTML = "";

  if (countryArray.error) {
    countryInfoC.innerHTML = `<p>${countryArray.error}</p>`;
    return;
  }

  let neighbourHTML = "<p>None</p>";
  if (countryArray.neighbours && countryArray.neighbours.length > 0) {
    const neighborsImages = await getNeighbourImages(countryArray.neighbours);
    neighbourHTML = "";
    for (let i = 0; i < countryArray.neighbours.length; i++) {
      neighbourHTML += `
      <p>${countryArray.neighbours[i]}</p>
      <img src="${neighborsImages[i]}" alt="${countryArray.neighbours[i]}'s Flag" width="50"/> `;
    }
  }

  const CountryInfoHTML = `
        <img src="${countryArray.flag}" alt="${countryArray.name}'s Flag" />
        <h2>${countryArray.name}</h2>
        <p><strong>Capital:</strong> ${countryArray.capital}</p>
        <p><strong>Population:</strong> ${countryArray.population}</p>
        <p><strong>Region:</strong> ${countryArray.region}</p>
        <p><strong>Neighbours:</strong></p>
       ${neighbourHTML}
    `;

  countryInfoC.innerHTML = CountryInfoHTML;
}

async function getCountryArr() {
  const countryN = country_name.value;

  await fetch(`https://restcountries.com/v3.1/name/${countryN}`)
    .then((response) => {
      if (!response.ok) {
        alert("Country not found or misspelled:(");
        throw new Error("Country not found or misspelled");
      }
      return response.json();
    })
    .then(async (data) => {
      const countryStuff = data[0];
      const countryArray = {
        name: countryStuff.name.common,
        capital: countryStuff.capital,
        population: countryStuff.population,
        region: countryStuff.region,
        flag: countryStuff.flags.png,
        neighbours: await getNeighbourNames(countryStuff.borders),
      };
      console.log(countryArray.name);
      await updateContent(countryArray);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getNeighbourNames(neighbours) {
  if (!neighbours) return [];
  const neighbourNames = [];

  for (let i = 0; i < neighbours.length; i++) {
    await fetch(`https://restcountries.com/v3.1/alpha/${neighbours[i]}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Country not found or misspelled");
        }
        return response.json();
      })
      .then((data) => {
        const neighbour = data[0];
        neighbourNames.push(neighbour.name.common);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  console.log(neighbourNames);
  return neighbourNames;
}

async function getNeighbourImages(neighbours) {
  if (!neighbours) return [];
  const neighbourFlags = [];

  for (let i = 0; i < neighbours.length; i++) {
    await fetch(`https://restcountries.com/v3.1/name/${neighbours[i]}`)
      .then((response) => {
        if (!response.ok) {
          alert("Country not found or misspelled");
          throw new Error("Country not found or misspelled");
        }
        return response.json();
      })
      .then((data) => {
        const neighbour = data[0];
        neighbourFlags.push(neighbour.flags.png);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return neighbourFlags;
}

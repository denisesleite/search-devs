let inputSearch = null; 
let labelSearch = null; 
let listDevs = null;
let countDevs = null;
let inputsRadio = null;
let inputsCheckbox = null;
let clearFilter = null;
let allDevs = [];
let filterDevs = [];

window.addEventListener("load", () => {
  start();
  fetchDevs();
});

function start() {
  inputSearch = document.querySelector('#search-input');
  labelSearch = document.querySelector('.label-search');
  listDevs = document.querySelector('.listDevs');
  countDevs = document.querySelector('.countDevs');
  inputsCheckbox = document.querySelectorAll('input[name="languagesInput"]');
  inputsRadio = document.querySelectorAll('input[name="searchRadio"]');
  clearFilter = document.querySelector('.clear-filter');

  inputSearch.focus();
}

async function fetchDevs() {
  const rest = await fetch("http://localhost:3001/devs");
  const json = await rest.json();

  allDevs = json.map(({ id, name, picture, programmingLanguages }) => {
      const nameLowerCase = name.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
      const descriptionDev = [];
      let languagesTypes = [];
      programmingLanguages.forEach((languages) => {
        const { language, experience, id } = languages;
        languagesTypes.push(language.toLocaleLowerCase());
        switch (language) {
          case "Java":
            descriptionDev.push({
              id,
              language,
              experience,
              icon: "../front/assets/icons/java.png",
            });
            break;
          case "JavaScript":
            descriptionDev.push({
              id,
              language,
              experience,
              icon: "../front/assets/icons/javascript.png",
            });
            break;
          case "Python":
            descriptionDev.push({
              id,
              language,
              experience,
              icon: "../front/assets/icons/python.png",
            });
            break;
          default:
            break;
        }
      });
      
      return {
        id,
        name,
        nameLowerCase,
        languagesTypes,
        picture,
        descriptionDev,
      };
    }).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  render();
  showDevs(allDevs)
}

function render(){
  filteredDevs();
  filteredDevsChecked();
}

function showDevs(devs){
  listDevs.innerHTML = devs.map(({name, picture, descriptionDev}) => {
    let img = ""
    descriptionDev.forEach(({icon}) => {
      return img += `<img src='${icon}' alt='${name}'/>`
    });

    return `
      <div class='dev'>
        <div class='dev--img'>
          <img src='${picture}' alt='${name}' />
        </div>
        <div class='dev--info'>
          <div class='dev--info_name'>
            <p>${name}</p>
          </div>
          <div class='dev--info_icon'>
            <p><strong><em>Skills:</em></strong></p>
            ${img}
          </div>
        </div>
      </div>
    `
  }).join("");

  countDevs.innerHTML = `< <strong>${devs.length}</strong> <em>devs encontrados</em> />`;
}

function filteredDevs(){
  inputSearch.addEventListener("keyup", (e) => {
    if(inputSearch.value !== ''){
      labelSearch.classList.add('actived');
    }else{
      labelSearch.classList.remove('actived');
    }

    let newValue = e.target.value.trim().toLowerCase();
    console.log(newValue)

    filterDevs = allDevs.filter(({nameLowerCase}) => {
      return nameLowerCase.toLowerCase().includes(newValue);
    });

    showDevs(filterDevs);
  });
}

function filteredDevsChecked(){
  let filteredLanguages = [];

  inputsCheckbox.forEach((input) => {
    input.addEventListener("change", (e) => {
      return e.target.checked ? filteredLanguages.push(e.target.id) : filteredLanguages.pop(e.target.id);
    });

    inputsRadio.forEach(elem => {
      elem.addEventListener("input", (e) => {
          inputSearch.value = "";
          filterDevs = allDevs.filter(({languagesTypes}) => {
          return e.target.id === "or"
            ? languagesTypes.some((dev) => filteredLanguages.includes(dev))
            : filteredLanguages.join("") === languagesTypes.join("");
        });
  
        showDevs(filterDevs);
      })
    });
  });


  clearFilter.addEventListener('click', (e) => {
    e.preventDefault();
    filteredLanguages = [];

    showDevs(allDevs);

    inputsCheckbox.forEach(checkbox => {
      checkbox.checked = false
    }); 

    inputsRadio.forEach(radiobox => {
      radiobox.checked = false
    }); 
  });
}
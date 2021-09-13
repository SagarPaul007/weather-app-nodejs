let inputEl = document.querySelector(".input")
let btn = document.querySelector(".btn")
let heading = document.querySelector(".heading")

btn.addEventListener("click", (e) => {
    e.preventDefault()
    heading.innerHTML = "Loading..."
    let address = inputEl.value
    fetch(`/weather?address=${address}`).then(res => res.json()).then(data => {
        console.log(data)
        let {description, icon, place, temp, humidity} = data
        heading.innerHTML = `${place}`
        document.querySelector(".data").innerHTML = `
            <img class="icon-img" src="http://openweathermap.org/img/wn/${icon}@4x.png" alt="" srcset="">
            <div class="top">
                <h2 class="description">${description}</h2>
            </div>
            <div class="bottom">
                <div class="temp">
                    Temperature: ${temp}°C
                </div>
                <div class="humidity">
                    Humidity: ${humidity}%
                </div>
            </div>`
    })
})
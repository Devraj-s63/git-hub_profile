const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");

const getUser = async (username) => {
    const response = await fetch(APIURL + username);

    if (!response.ok) {
        main.innerHTML = `<p>User not found</p>`;
        return;
    }

    const data = await response.json();
    if (data.message === "Not Found") {
        main.innerHTML = `<p>User not found</p>`;
        return;
    }

    const card = `
        <div class="card">
            <div>
                <img class="avatar" src="${data.avatar_url}" alt="${data.name}" />
            </div>
            <div class="user-info">
                <h2>${data.name}</h2>
                <p>${data.bio || "No bio available."}</p>
                <ul class="info">
                    <li>${data.followers}<strong> Followers</strong></li>
                    <li>${data.following}<strong> Following</strong></li>
                    <li>${data.public_repos}<strong> Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;
    main.innerHTML = card;
    getRepos(username);
};

const getRepos = async (username) => {
    const reposContainer = document.querySelector("#repos");
    const response = await fetch(APIURL + username + "/repos");

    if (!response.ok) {
        reposContainer.innerHTML = `<p>Error loading repositories</p>`;
        return;
    }

    const data = await response.json();
    if (data.length === 0) {
        reposContainer.innerHTML = `<p>No repositories found</p>`;
    } else {
        data.forEach((repo) => {
            const ele = document.createElement("a");
            ele.classList.add("repo");
            ele.href = repo.html_url;
            ele.innerText = repo.name;
            ele.target = "_blank";
            reposContainer.appendChild(ele);
        });
    }
};

const formSubmit = () => {
    if (searchBox.value.trim() !== "") {
        getUser(searchBox.value.trim());
        searchBox.value = "";
    }
    return false;
};

// Use a form submission handler instead of focusout for better UX
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    formSubmit();
});

/* =======================================================
   Alexandria Prototype
   Part 1
======================================================= */

const STORAGE_KEY = "alexandria_user";

/* =======================================================
   Helpers
======================================================= */

function saveUser(user){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
    );

}

function getUser(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(!data) return null;

    return JSON.parse(data);

}

function logout(){

    localStorage.removeItem(STORAGE_KEY);

    location.reload();

}

/* =======================================================
   Default User
======================================================= */

function createEmptyUser(){

    return{

        logged:true,

        email:"",

        xp:0,

        streak:0,

        pregnant:false,

        pregnancyWeek:null,

        children:[],

        badges:[],

        completedToday:false

    }

}

/* =======================================================
   Login
======================================================= */

function login(){

    const email=document
        .getElementById("email")
        .value;

    const password=document
        .getElementById("password")
        .value;

    if(email==="" || password===""){

        alert("Please enter email and password.");

        return;

    }

    let user=createEmptyUser();

    user.email=email;

    saveUser(user);

    openOnboarding();

}

/* =======================================================
   Initial Load
======================================================= */

window.onload=function(){

    const user=getUser();

    if(!user){

        document
            .getElementById("loginScreen")
            .classList.remove("hidden");

        return;

    }

    if(user.children.length===0 && !user.pregnant){

        openOnboarding();

        return;

    }

    openDashboard();

}

/* =======================================================
   Screens
======================================================= */

function hideAllScreens(){

    document
        .getElementById("loginScreen")
        .classList.add("hidden");

    document
        .getElementById("onboardingScreen")
        .classList.add("hidden");

    document
        .getElementById("dashboard")
        .classList.add("hidden");

}

function openOnboarding(){

    hideAllScreens();

    document
        .getElementById("onboardingScreen")
        .classList.remove("hidden");

}

function openDashboard(){

    hideAllScreens();

    document
        .getElementById("dashboard")
        .classList.remove("hidden");

    loadDashboard();

}

/* =======================================================
   Pregnancy
======================================================= */

function pregnantYes(){

    document
        .getElementById("pregnancyQuestions")
        .classList.remove("hidden");

    document
        .getElementById("childrenQuestions")
        .classList.add("hidden");

}

function pregnantNo(){

    document
        .getElementById("childrenQuestions")
        .classList.remove("hidden");

    document
        .getElementById("pregnancyQuestions")
        .classList.add("hidden");

}

/* =======================================================
   Children
======================================================= */

function createChildrenInputs(){

    const total=parseInt(
        document
        .getElementById("childrenNumber")
        .value
    );

    const div=document
        .getElementById("childrenForms");

    div.innerHTML="";

    if(!total || total<=0){

        return;

    }

    for(let i=0;i<total;i++){

        div.innerHTML+=`

        <div class="child-card">

            <h4>

                Child ${i+1}

            </h4>

            <input
                id="childName${i}"
                placeholder="Name">

            <input
                id="childAge${i}"
                type="number"
                placeholder="Age">

        </div>

        `;

    }

}

/* =======================================================
   Finish Onboarding
======================================================= */

function finishOnboarding(){

    let user=getUser();

    if(!user){

        user=createEmptyUser();

    }

    const week=document
        .getElementById("weeks")
        .value;

    if(week){

        user.pregnant=true;

        user.pregnancyWeek=parseInt(week);

    }

    const total=parseInt(
        document
        .getElementById("childrenNumber")
        .value
    );

    user.children=[];

    if(total){

        for(let i=0;i<total;i++){

            const child={

                name:document
                    .getElementById(`childName${i}`)
                    .value,

                age:parseInt(

                    document
                    .getElementById(`childAge${i}`)
                    .value

                ),

                xp:0

            };

            user.children.push(child);

        }

    }

    saveUser(user);

    openDashboard();

}

/* =======================================================
   Navigation
======================================================= */

function showTab(tab){

    document
        .querySelectorAll(".tab")
        .forEach(item=>{

            item.classList.add("hidden");

        });

    document
        .getElementById(tab)
        .classList.remove("hidden");

}
// =========================
// ONBOARDING
// =========================

const startBtn = document.getElementById("startBtn");

startBtn.onclick = () => {

    const profile = {
        pregnant: document.querySelector('input[name="pregnant"]:checked')?.value || "no",
        pregnancyWeeks: document.getElementById("pregnancyWeeks").value,
        children: []
    };

    document.querySelectorAll(".child-card").forEach(card=>{

        profile.children.push({

            name: card.querySelector(".child-name").value,
            age: card.querySelector(".child-age").value

        });

    });

    localStorage.setItem(
        "alex_profile",
        JSON.stringify(profile)
    );

    initializeDashboard(profile);

};



// =========================
// LOAD USER
// =========================

window.onload = ()=>{

    if(localStorage.getItem("alex_logged")){

        const profile = JSON.parse(
            localStorage.getItem("alex_profile")
        );

        if(profile){

            initializeDashboard(profile);

        }else{

            showOnboarding();

        }

    }

};




// =========================
// XP
// =========================

let xp = Number(localStorage.getItem("alex_xp")) || 0;

function addXP(points){

    xp += points;

    localStorage.setItem("alex_xp",xp);

    updateXP();

}

function updateXP(){

    document.getElementById("xpValue").innerHTML = xp;

}



// =========================
// DASHBOARD
// =========================

function initializeDashboard(profile){

    onboarding.classList.add("hidden");

    dashboard.classList.remove("hidden");

    updateXP();

    generateDailyPlan(profile);

    generateInstitutions();

}
// =========================
// DAILY PLAN
// =========================

function generateDailyPlan() {

    const container = document.getElementById("dailyPlan");

    container.innerHTML = "";

    let plan = [];

    children.forEach(child => {

        if(child.age == 0){

            plan.push({
                child: child.name,
                tasks:[
                    "Read a short picture book (10 min)",
                    "Tummy time",
                    "Talk and sing during feeding"
                ]
            });

        }else if(child.age <= 2){

            plan.push({
                child: child.name,
                tasks:[
                    "Read together",
                    "Stack blocks",
                    "Outdoor walk",
                    "Name everyday objects"
                ]
            });

        }else if(child.age <=4){

            plan.push({
                child: child.name,
                tasks:[
                    "Pretend play",
                    "Read a story",
                    "Count objects",
                    "Nature walk"
                ]
            });

        }else{

            plan.push({
                child: child.name,
                tasks:[
                    "Practice letters",
                    "Drawing activity",
                    "Bike or park",
                    "Read for 15 minutes"
                ]
            });

        }

    });

    if(plan.length == 0){

        container.innerHTML = `
            <p>Add your child first.</p>
        `;

        return;

    }

    plan.forEach(p=>{

        let html = `
        <div class="plan-card">

            <h3>${p.child}</h3>

        `;

        p.tasks.forEach(task=>{

            html += `
                <label class="task">

                    <input type="checkbox">

                    ${task}

                </label>
            `;

        });

        html += `
            <button onclick="completeDay()">Complete Today (+50 XP)</button>
        </div>
        `;

        container.innerHTML += html;

    });

}


// =========================
// COMPLETE DAY
// =========================

function completeDay(){

    xp += 50;

    saveXP();

    updateXP();

    alert("Awesome! +50 XP earned 🎉");

}


// =========================
// NEARBY SERVICES
// =========================

const nearby = [

    {
        type:"Hospital",
        name:"NHS Community Health Centre",
        desc:"Pediatric consultations and vaccinations."
    },

    {
        type:"NGO",
        name:"Family Support Hub",
        desc:"Parenting workshops and child development."
    },

    {
        type:"Event",
        name:"Storytelling Saturday",
        desc:"Weekly reading activities for children."
    },

    {
        type:"Park",
        name:"Community Green Park",
        desc:"Outdoor play and social interaction."
    }

];

function renderNearby(){

    const container = document.getElementById("nearbyList");

    container.innerHTML = "";

    nearby.forEach(item=>{

        container.innerHTML += `

        <div class="near-card">

            <h3>${item.type}</h3>

            <strong>${item.name}</strong>

            <p>${item.desc}</p>

            <button onclick="earnPartnerXP()">

                I visited (+20 XP)

            </button>

        </div>

        `;

    });

}

function earnPartnerXP(){

    xp += 20;

    saveXP();

    updateXP();

}


// =========================
// NHS RESOURCES
// =========================

const resources = [

    {
        title:"Pregnancy",
        url:"https://www.nhs.uk/pregnancy/"
    },

    {
        title:"Baby",
        url:"https://www.nhs.uk/start-for-life/"
    },

    {
        title:"Child Development",
        url:"https://www.nhs.uk/conditions/baby/"
    },

    {
        title:"Vaccinations",
        url:"https://www.nhs.uk/vaccinations/"
    }

];

function renderResources(){

    const container = document.getElementById("resources");

    if(!container) return;

    container.innerHTML = "";

    resources.forEach(r=>{

        container.innerHTML += `

        <div class="resource">

            <h3>${r.title}</h3>

            <a href="${r.url}" target="_blank">

                Open NHS Guide →

            </a>

        </div>

        `;

    });

}


// =========================
// TABS
// =========================

function showTab(tab){

    document.querySelectorAll(".tab-content").forEach(el=>{

        el.classList.add("hidden");

    });

    document.getElementById(tab).classList.remove("hidden");

}


// =========================
// INIT
// =========================

window.onload = () => {

    updateXP();

    if(localStorage.getItem("alex_logged")){

        if(localStorage.getItem("alex_profile")){

            loginPage.classList.add("hidden");

            onboarding.classList.add("hidden");

            dashboard.classList.remove("hidden");

        }else{

            showOnboarding();

        }

    }

    loadChildren();

    generateDailyPlan();

    renderNearby();

    renderResources();

};

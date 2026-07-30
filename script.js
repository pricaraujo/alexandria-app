// ========================================
// ALEXANDRIA MVP
// PART 1 - LOGIN + ONBOARDING
// ========================================

// ---------- Screens ----------

const loginScreen = document.getElementById("loginScreen");
const onboardingScreen = document.getElementById("onboardingScreen");
const dashboard = document.getElementById("dashboard");

// ---------- State ----------

let profile = {
    pregnant: false,
    weeks: null,
    children: []
};

let xp = Number(localStorage.getItem("alex_xp")) || 0;


// ========================================
// LOGIN
// ========================================

function login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email.length < 4 || password.length < 4){

        alert("Please enter a valid email and password.");
        return;

    }

    localStorage.setItem("alex_logged","true");

    if(localStorage.getItem("alex_profile")){

        profile = JSON.parse(localStorage.getItem("alex_profile"));

        showDashboard();

    }else{

        showOnboarding();

    }

}


// ========================================
// SCREENS
// ========================================

function showOnboarding(){

    loginScreen.classList.add("hidden");
    onboardingScreen.classList.remove("hidden");
    dashboard.classList.add("hidden");

}

function showDashboard(){

    loginScreen.classList.add("hidden");
    onboardingScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");

    updateXP();

    if(typeof loadProfile === "function"){
        loadProfile();
    }

    if(typeof loadInstitutions === "function"){
        loadInstitutions();
    }

    showTab("today");

}


// ========================================
// PREGNANCY
// ========================================

function pregnantYes(){

    profile.pregnant = true;

    document
        .getElementById("pregnancyQuestions")
        .classList.remove("hidden");

    document
        .getElementById("childrenQuestions")
        .classList.add("hidden");

}

function pregnantNo(){

    profile.pregnant = false;

    document
        .getElementById("childrenQuestions")
        .classList.remove("hidden");

    document
        .getElementById("pregnancyQuestions")
        .classList.add("hidden");

}


// ========================================
// CHILDREN
// ========================================

function createChildrenInputs(){

    const quantity = Number(
        document.getElementById("childrenNumber").value
    );

    const container = document.getElementById("childrenForms");

    container.innerHTML = "";

    if(quantity <= 0){

        alert("Please enter at least one child.");

        return;

    }

    for(let i=0;i<quantity;i++){

        container.innerHTML += `

            <div class="child-card">

                <h4>Child ${i+1}</h4>

                <input
                    id="child_name_${i}"
                    placeholder="Name">

                <input
                    id="child_age_${i}"
                    type="number"
                    placeholder="Age">

            </div>

        `;

    }

}


// ========================================
// FINISH ONBOARDING
// ========================================

function finishOnboarding(){

    profile.children = [];

    if(profile.pregnant){

        profile.weeks = Number(
            document.getElementById("weeks").value
        ) || 0;

    }

    const quantity =
        Number(document.getElementById("childrenNumber").value) || 0;

    for(let i=0;i<quantity;i++){

        const name = document
            .getElementById(`child_name_${i}`)
            ?.value || "";

        const age = Number(
            document
                .getElementById(`child_age_${i}`)
                ?.value
        ) || 0;

        profile.children.push({

            name,
            age

        });

    }

    localStorage.setItem(

        "alex_profile",
        JSON.stringify(profile)

    );

    addXP(100);

    showDashboard();

}


// ========================================
// XP
// ========================================

function addXP(points){

    xp += points;

    localStorage.setItem(

        "alex_xp",
        xp

    );

    updateXP();

}

function updateXP(){

    const xpElement = document.getElementById("xp");

    if(xpElement){

        xpElement.innerText = xp;

    }

}


// ========================================
// AUTO LOGIN
// ========================================

window.onload = () => {

    if(localStorage.getItem("alex_logged")){

        const saved = localStorage.getItem("alex_profile");

        if(saved){

            profile = JSON.parse(saved);

            showDashboard();

        }else{

            showOnboarding();

        }

    }

};
// ========================================
// PART 2 - DASHBOARD + DAILY PLAN
// ========================================


// ---------- Tabs ----------

function showTab(tabName){

    document
        .querySelectorAll(".tab")
        .forEach(tab => tab.classList.add("hidden"));

    const tab = document.getElementById(tabName);

    if(tab){

        tab.classList.remove("hidden");

    }

}



// ========================================
// DAILY PLAN
// ========================================

function generatePlan(){

    const mood =
        document.getElementById("mood").value;

    const container =
        document.getElementById("dailyPlan");

    let html = "";

    html += `
        <h2>Today's Personalized Plan</h2>
    `;


    // ================= Pregnancy =================

    if(profile.pregnant){

        html += `

        <div class="activity">

            <h3>Pregnancy Care</h3>

            <ul>

                <li>✔ Stay hydrated.</li>

                <li>✔ Take a gentle 20 minute walk.</li>

                <li>✔ Eat iron-rich foods.</li>

                <li>✔ Rest whenever needed.</li>

            </ul>

            <a target="_blank"
               href="https://www.nhs.uk/pregnancy/">

               NHS Pregnancy Guide

            </a>

        </div>

        `;

    }



    // ================= Children =================

    profile.children.forEach(child=>{

        html += generateChildPlan(child,mood);

    });


    // ================= Checklist =================

    html += `

    <div class="activity">

        <h3>Today's Checklist</h3>

        <label>

            <input type="checkbox"
                   onchange="gainChecklistXP(this)">

            Read together

        </label>

        <br><br>

        <label>

            <input type="checkbox"
                   onchange="gainChecklistXP(this)">

            Outdoor play

        </label>

        <br><br>

        <label>

            <input type="checkbox"
                   onchange="gainChecklistXP(this)">

            Healthy meal

        </label>

        <br><br>

        <label>

            <input type="checkbox"
                   onchange="gainChecklistXP(this)">

            Bedtime routine

        </label>

    </div>

    `;


    container.innerHTML = html;

}



// ========================================
// CHILD PLAN
// ========================================

function generateChildPlan(child,mood){

    let activities = [];


    // Age recommendations

    if(child.age < 1){

        activities = [

            "Tummy time",
            "Talk to your baby",
            "Skin-to-skin interaction"

        ];

    }

    else if(child.age <=3){

        activities = [

            "Read one picture book",
            "Stack blocks",
            "Outdoor exploration"

        ];

    }

    else{

        activities = [

            "Storytelling",
            "Drawing together",
            "Nature walk"

        ];

    }


    // Mood adjustments

    if(mood==="Sick"){

        activities.push("Offer fluids frequently");
        activities.push("Monitor temperature");

    }

    if(mood==="Tired"){

        activities.push("Earlier bedtime");
        activities.push("Quiet reading");

    }

    if(mood==="Energetic"){

        activities.push("Park activities");
        activities.push("Dance together");

    }


    return `

    <div class="activity">

        <h3>${child.name} (${child.age} years)</h3>

        <ul>

            ${activities.map(item=>`<li>✔ ${item}</li>`).join("")}

        </ul>

        <a target="_blank"
           href="https://www.nhs.uk/start-for-life/baby/">

           NHS Child Development

        </a>

    </div>

    `;

}



// ========================================
// CHECKLIST XP
// ========================================

function gainChecklistXP(box){

    if(box.checked){

        addXP(20);

    }

}
// ========================================
// PART 3 - PROFILE + COMMUNITY + LOGOUT
// ========================================


// ========================================
// PROFILE
// ========================================

function loadProfile(){

    const family = document.getElementById("family");

    if(!family) return;

    let html = "";

    if(profile.pregnant){

        html += `

        <div class="activity">

            <h3>🤰 Pregnancy</h3>

            <p><strong>${profile.weeks}</strong> weeks</p>

        </div>

        `;

    }

    if(profile.children.length===0){

        html += `

        <div class="activity">

            <p>No children registered yet.</p>

        </div>

        `;

    }

    profile.children.forEach(child=>{

        html += `

        <div class="activity">

            <h3>${child.name}</h3>

            <p>${child.age} years old</p>

        </div>

        `;

    });

    html += `

    <div class="activity">

        <h3>Total XP</h3>

        <h2>${xp}</h2>

    </div>

    `;

    family.innerHTML = html;

}



// ========================================
// COMMUNITY
// ========================================

function loadInstitutions(){

    const container =
        document.getElementById("institutions");

    if(!container) return;

    const places=[

        {

            name:"NHS Children's Centre",

            type:"Parenting Support",

            xp:40,

            link:"https://www.nhs.uk/start-for-life/"

        },

        {

            name:"UNICEF Early Childhood",

            type:"Family Resources",

            xp:50,

            link:"https://www.unicef.org/parenting"

        },

        {

            name:"Local Pediatric Hospital",

            type:"Healthcare",

            xp:80,

            link:"https://www.nhs.uk/"

        },

        {

            name:"Community Reading Club",

            type:"Weekly Event",

            xp:25,

            link:"https://www.booktrust.org.uk/"

        }

    ];

    container.innerHTML="";

    places.forEach(place=>{

        container.innerHTML += `

        <div class="activity">

            <h3>${place.name}</h3>

            <p>${place.type}</p>

            <p>Reward: ${place.xp} XP</p>

            <button onclick="visitPlace(${place.xp})">

                Check-in

            </button>

            <br><br>

            <a href="${place.link}"

               target="_blank">

               Learn more

            </a>

        </div>

        `;

    });

}



// ========================================
// CHECK-IN
// ========================================

function visitPlace(points){

    addXP(points);

    alert("Thanks for participating! +" + points + " XP");

}



// ========================================
// LOGOUT
// ========================================

function logout(){

    localStorage.removeItem("alex_logged");

    location.reload();

}



// ========================================
// RESET (useful while testing)
// ========================================

function resetPrototype(){

    localStorage.clear();

    location.reload();

}



// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded",()=>{

    updateXP();

    if(localStorage.getItem("alex_profile")){

        profile = JSON.parse(

            localStorage.getItem("alex_profile")

        );

    }

    loadProfile();

    loadInstitutions();

});

const pregnantBtn = document.getElementById("pregnantBtn");
const parentBtn = document.getElementById("parentBtn");

const pregnancyForm = document.getElementById("pregnancyForm");
const childrenForm = document.getElementById("childrenForm");
const childrenContainer = document.getElementById("childrenContainer");
const results = document.getElementById("results");

pregnantBtn.onclick = () => {

    pregnancyForm.classList.remove("hidden");
    childrenForm.classList.add("hidden");
    results.classList.add("hidden");

};

parentBtn.onclick = () => {

    childrenForm.classList.remove("hidden");
    pregnancyForm.classList.add("hidden");
    results.classList.add("hidden");

};

function generateChildrenInputs(){

    childrenContainer.innerHTML="";

    const quantity = parseInt(document.getElementById("children").value);

    if(!quantity || quantity<1){

        alert("Please enter the number of children.");

        return;

    }

    for(let i=1;i<=quantity;i++){

        childrenContainer.innerHTML += `

        <div class="child-card">

            <h3>Child ${i}</h3>

            <label>Age</label>

            <select id="age${i}">

                <option value="0">0-12 months</option>

                <option value="1">1 year</option>

                <option value="2">2 years</option>

                <option value="3">3 years</option>

                <option value="4">4 years</option>

                <option value="5">5 years</option>

                <option value="6">6 years</option>

            </select>

        </div>

        `;

    }

    childrenContainer.innerHTML += `

    <button onclick="showChildrenAdvice()">

        Generate recommendations

    </button>

    `;

}

function showPregnancyAdvice(){

    const weeks = parseInt(document.getElementById("weeks").value);

    let advice=[];

    if(weeks<=12){

        advice=[

            "Take folic acid daily.",

            "Book your first antenatal appointment.",

            "Avoid alcohol and smoking.",

            "Eat a balanced diet."

        ];

    }

    else if(weeks<=27){

        advice=[

            "Monitor baby's movements.",

            "Maintain moderate physical activity.",

            "Stay hydrated.",

            "Attend routine prenatal visits."

        ];

    }

    else{

        advice=[

            "Prepare your birth plan.",

            "Learn breastfeeding basics.",

            "Pack your hospital bag.",

            "Know the signs of labour."

        ];

    }

    results.classList.remove("hidden");

    results.innerHTML=`

    <div class="result-card">

        <span class="badge">

            Pregnancy • ${weeks} weeks

        </span>

        <h3>Your recommendations</h3>

        <ul>

            ${advice.map(item=>`<li>${item}</li>`).join("")}

        </ul>

        <div class="progress">

            <div class="progress-bar" style="width:${Math.min((weeks/40)*100,100)}%"></div>

        </div>

        <div class="xp">

            ⭐ +25 XP earned

        </div>

    </div>

    `;

}

function getAdvice(age){

    switch(age){

        case 0:

            return [

                "Practice skin-to-skin contact.",

                "Breastfeed on demand when possible.",

                "Follow the immunization schedule.",

                "Talk and sing to your baby daily."

            ];

        case 1:

            return [

                "Encourage crawling and walking.",

                "Read together every day.",

                "Offer a variety of healthy foods.",

                "Reduce screen exposure."

            ];

        case 2:

            return [

                "Support language development.",

                "Encourage pretend play.",

                "Maintain healthy sleep routines.",

                "Promote independent eating."

            ];

        case 3:

            return [

                "Practice counting and colours.",

                "Play outdoors every day.",

                "Read bedtime stories.",

                "Develop emotional vocabulary."

            ];

        case 4:

            return [

                "Stimulate creativity through drawing.",

                "Encourage friendships.",

                "Practice sharing.",

                "Keep routines consistent."

            ];

        case 5:

            return [

                "Prepare for school.",

                "Promote physical activity.",

                "Develop responsibility through small tasks.",

                "Continue reading together."

            ];

        default:

            return [

                "Encourage curiosity.",

                "Support literacy skills.",

                "Promote independence.",

                "Celebrate achievements."

            ];

    }

}

function showChildrenAdvice(){

    const quantity=parseInt(document.getElementById("children").value);

    results.classList.remove("hidden");

    results.innerHTML="";

    for(let i=1;i<=quantity;i++){

        const age=parseInt(document.getElementById(`age${i}`).value);

        const advice=getAdvice(age);

        results.innerHTML += `

        <div class="result-card">

            <span class="badge">

                Child ${i}

            </span>

            <h3>${age} year${age!==1?"s":""}</h3>

            <ul>

                ${advice.map(item=>`<li>${item}</li>`).join("")}

            </ul>

            <div class="progress">

                <div class="progress-bar" style="width:${(age/6)*100}%"></div>

            </div>

            <div class="tip">

                📌 Based on trusted NHS & UNICEF parenting guidance.

            </div>

            <div class="xp">

                ⭐ +50 XP earned

            </div>

        </div>

        `;

    }

    results.scrollIntoView({

        behavior:"smooth"

    });

}
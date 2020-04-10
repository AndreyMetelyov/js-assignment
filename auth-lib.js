let allusers = [];
    //arguments.length 
    //includes - альтернатива indexof
// Возвращает массив всех пользователей.
var allrights = ["view site","play games","manage content",
    "login as","delete users"];
var allgroups = [
    {name: "admin", rights: [allrights[0], allrights[1], allrights[2],
    allrights[3],allrights[4]]},
     {name: "tester", rights: [allrights[0], allrights[1], allrights[2],allrights[3]]},
	{name: "manager", rights: [allrights[0], allrights[1], allrights[2]]},
    {name: "basic", rights: [allrights[0], allrights[1]]},
    {name: "guest", rights: [allrights[0]]}
]
activeSession = undefined;

function users() {
    return allusers;
}

//Создает нового пользователя с указанным логином username и паролем password, возвращает созданного пользователя.
function createUser(name, password) {
    allusers.push({name: name, password: password,groups:[]});
    return allusers[allusers.length-1];
}

// Удаляет пользователя user
function deleteUser(user) {
    if (!user) { throw Error("exception. undefined value"); }
    if (allusers.indexOf(user)===-1) {throw Error("exception. incorrect user");}
    allusers.splice(allusers.indexOf(user),1);
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
    return allusers[allusers.indexOf(user)].groups;
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
    if (!user || !group) { throw Error("exception. undefined value"); }
    if (!allusers.includes(user)) { throw Error("exception. incorrect user"); }
    if (!allgroups.includes(group)) {throw Error("exception. incorrect group");}
    
    allusers[allusers.indexOf(user)].groups.push(group);
}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
    if (!user || !group) { throw Error("exception. undefined value"); }
    if (!allusers.includes(user)) { throw Error('exception.incorrect user');}
    if (!allgroups.includes(group)) {throw Error("exception. incorrect group");}
    
    let userindex = allusers.indexOf(user);
    if (!allusers[userindex].groups.includes(group)) {throw Error("exception. user don't exist in this group");}
    let groupindex = allusers[userindex].groups.indexOf(group);
    allusers[userindex].groups.splice(groupindex,1);
}

// Возвращает массив прав
function rights() {
    return allrights;
}

// Создает новое право с именем name и возвращает его
function createRight(name) {
    allrights.push(name);
    return allrights[allrights.length-1];
}

// Удаляет право right
function deleteRight(right) {
    if (!right) { throw Error("exception. undefined value");}
    if (!allrights.includes(right)) { throw Error("exception. Right don't exist")};
    allrights.splice(allrights.indexOf(right),1);
    allgroups.forEach(group=>{
        let rightindex = group.rights.indexOf(right);
        if (rightindex!=-1) group.rights.splice(rightindex,1); 
    });
}

// Возвращает массив групп
function groups() {
    return allgroups;
}

// Создает новую группу и возвращает её.
function createGroup(name) {
    allgroups.push({name:name,rights:[]});
    return allgroups[allgroups.length-1];
}

// Удаляет группу group
function deleteGroup(group) {
    if (!group) throw Error('exception. Undefined value');
    if (!allgroups.includes(group)) throw Error('exception. Wrong group');
    allgroups.splice(allgroups.indexOf(group),1);
    allusers.forEach(user=>{
        let groupindex = user.groups.indexOf(group);
        if (groupindex!=-1) user.groups.splice(groupindex,1);
    });
    
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
    return allgroups[allgroups.indexOf(group)].rights;
}

// Добавляет право right к группе group
function addRightToGroup(right,group) {
    if (!right || !group) throw Error('exception. Indefined value');
    if (!allgroups.includes(group)) throw Error('exception. Wrong group');
    if (!allrights.includes(right)) throw Error('exception.Right \"'+right+'\" dont exist');
    let groupindex = allgroups.indexOf(group);
    allgroups[groupindex].rights.push(right);
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right,group) {
    if (!right || !group) { throw Error('exception. Undefined value'); }
    if (!allrights.includes(right)) {throw Error('exception.Right dont exist');}
    if (!allgroups.includes(group)) {throw Error('exception.Group dont exist');}

    let groupindex = allgroups.indexOf(group);
    let rightindex = allgroups[groupindex].rights.indexOf(right);
    if (rightindex==-1) 
    {throw Error('Right \"'+right+'\" dont exist in group \"'+group+'\"');}

    allgroups[groupindex].rights.splice(rightindex,1);
}


function login(username, password) {
    if (!activeSession) {
        for (let i=0;i<allusers.length;i++)
        {
            if (allusers[i].name === username 
                && allusers[i].password === password)
            { 
                activeSession = [];
                activeSession.push(allusers[i]);
                return true;
            }
        }
    }
    else return false;
}

function currentUser() {
    if (!activeSession) return activeSession;
    else return activeSession[activeSession.length-1];
}

function logout() {
    if (activeSession) 
    {
        if (activeSession.length == 1) activeSession = undefined;
        else 
            if (Array.isArray(activeSession)) 
                activeSession.splice(activeSession.length-1,1);
    }
    else throw Error('Exception.No active session');
}

function isAuthorized(user, right) {
    if (!user || !right) throw Error('Exception. Undefined value');
    if (!allusers.includes(user)) throw Error('Exception. User dont exist');
    if (!allrights.includes(right)) throw Error('Exception. Right dont exist');
    let userindex = allusers.indexOf(user);
    for (let i=0;i<allusers[userindex].groups.length;i++)
    {
        if (allusers[userindex].groups[i].rights.includes(right)) return true;
    }
    return false;
}
function loginAs(user)
{
    if (!user || !activeSession) throw Error('Exception. Undefined value');
    if (!allusers.includes(user)) throw Error('Exception. User dont exist');
    let groups_with_loginAs_Right = [];
    let loginas_right_index = allrights.indexOf("login as");
    let loginas_right = allrights[loginas_right_index];
    if (isAuthorized(currentUser(),loginas_right)) activeSession.push(user);
    else throw Error('Exception. User havent got enougth rights for loginAs');
}
function securityWrapper(action, right)
{
    allListeners.forEach(listener=>{
        listener(currentUser(),action);
    });
    if (!currentUser()) return undefined;
    if (isAuthorized(currentUser(),right)) {
        return action;
    }
    else return function(){};
}
//-----------------------------------------
var user1 = createUser("admin", "1234");
deleteUser(user1);
var right1 = createRight('myright');
deleteRight(right1);
var group1 = createGroup('mygroup');
deleteGroup(group1);


var group = createGroup('mygroup');
var user  = createUser("user", "myuser");
addUserToGroup(user, group);
removeUserFromGroup(user,group);

var right = createRight('myright');
var right2 = createRight('myright2');
addRightToGroup(right, group);
addRightToGroup(right2, group);

userGroups(user);
addUserToGroup(user,group);
userGroups(user);
deleteGroup(group);
userGroups(user);

console.log(currentUser());
var user123 = createUser("user123", "user123");
console.log(login("user123","user123"));
console.log(currentUser());
logout();

//доп задания
var groupAdmin = allgroups[0];
var groupTester = allgroups[1];
var groupManager = allgroups[2];
var groupBasic = allgroups[3];
var groupGuest = allgroups[4];

var userAdmin = createUser("userAdmin","userAdmin1");
addUserToGroup(userAdmin,groupAdmin);
var userTester = createUser("userTester","userTester1");
addUserToGroup(userTester,groupTester);
var userManager = createUser("userManager","userManager1");
addUserToGroup(userManager,groupManager);
var userBasic = createUser("userBasic","userBasic1");
addUserToGroup(userBasic,groupBasic);
var userGuest = createUser("userGuest");
addUserToGroup(userGuest,groupGuest);

login("userGuest");
//loginAs(userAdmin); //throw error
logout();

login("userAdmin","userAdmin1");
console.log(currentUser());//admin
loginAs(userTester);
console.log(currentUser());//Tester
logout();
console.log(currentUser());//admin
logout();
console.log(currentUser());//undefined
//----------------------------------
var counter = 0;
function increaseCounter(amount) { counter += amount };

allListeners = [];
function addActionListener(listener)
{
    allListeners.push(listener);
}

addActionListener(function(user, action) { 
    console.log("Пользователь " + user + " только что сделал " + action.name); 
});
addActionListener(function(user, action) { 
    alert("Пользователь " + user + " только что сделал " + action.name); 
});

login("userAdmin","userAdmin1"); 
var secureIncreaseCounter = securityWrapper(increaseCounter, allrights[4]);
secureIncreaseCounter(1);
logout();
console.log(counter == 1); // -> true

login("userGuest");
var secureIncreaseCounter = securityWrapper(increaseCounter, allrights[4]);
secureIncreaseCounter(1);
logout();
console.log(counter == 2); // -> false 

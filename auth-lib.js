let allusers = [];
    //arguments.length 
    //includes - альтернатива indexof
// Возвращает массив всех пользователей.
var allrights = ["manage content", "play games", "delete users", "view site"];
var allgroups = [
	{name: "admin", rights: [allrights[2]]},
	{name: "manager", rights: [allrights[0]]},
	{name: "basic", rights: [allrights[1], allrights[3]]}
]

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
    if (!group) { throw Error('exception. Undefined value');}
    if (!allgroups.includes(group)) {throw Error('exception. Wrong group');}
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
    if (!right || !group) { throw Error('exception. Indefined value');}
    if (!allgroups.includes(group)) { throw Error('exception. Wrong group');}
    if (Array.isArray(right))
    {
        right.forEach(el => { 
            if (!allrights.includes(el)) { throw Error('exception.Right \"'+right+'\" dont exist');}}
            );
        right.forEach(el => { 
            let groupindex = allgroups.indexOf(group);
            allgroups[groupindex].rights.push(el);});
    }
    else {
    if (!allrights.includes(right)) 
    { throw Error('exception.Right \"'+right+'\" dont exist');}
    let groupindex = allgroups.indexOf(group);
    allgroups[groupindex].rights.push(right);
    }

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

function login(username, password) {}

function currentUser() {}

function logout() {}

function isAuthorized(user, right) {}


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
let masrights=[];
masrights.push(right);
masrights.push(right2);
/*
addRightToGroup(right, group);
addRightToGroup(right2, group);
*/
addRightToGroup(masrights, group);

userGroups(user);
addUserToGroup(user,group);
userGroups(user);
deleteGroup(group);
userGroups(user);
var users = {
    sz: '思竹',
    mz: '麦梓',
    sf: '思霏',
    xs: '萧稍',
    hy: '霍雍',
    
    hd: '辉达',
    em: '俄木',
    yq: '幽琪'
};

module.exports = {
    getUserName: function(user) {
        return users[user] || user;
    }
}
let config = {
    redis_port : 6379,							//Redis Port
	redis_hostname : "localhost", 				//Redis Hostname 
	admin_users : ['amit'], 					//Add usernames for different admins
    password : 'cGFzc3dvcmQ=',					//Admin Password btoa hashed (Default = 'password')
    admin_url : '/adminURL',					//URL where admin panel can be accessed
};

module.exports = config;
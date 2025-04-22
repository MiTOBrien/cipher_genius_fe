<script setup></script>

<template>
  <div class="login-form">
    <input type="text" />
    <br />
    <label>Username</label>
    <br />
    <input type="text" />
    <br />
    <label>First Name</label>
    <br />
    <input type="text" />
    <br />
    <label>Last Name</label>
    <br />
    <input type="email" />
    <br />
    <label>Email Address</label>
    <br />
    <input type="password" />
    <br />
    <label>Password</label>
    <br />
    <input type="password" />
    <br />
    <label>Confirm Password</label>
    <br />
    <button>Register</button>
    <p>Go to <RouterLink to="/">login page</RouterLink></p>
    <p>or <RouterLink to="/home">countine as a guest</RouterLink>.</p>
  </div>
</template>

<style scoped>
input {
  margin: 10px;
}

button {
  margin: 10px;
  height: 50px;
  width: 100px;
  font-size: 1.25rem;
  color: #01bfff;
  background-color: #241822;
}

a {
  color: #01bfff;
}

label,
p {
  color: #84ce00;
}

.login-form {
  text-align: center;
}
</style>

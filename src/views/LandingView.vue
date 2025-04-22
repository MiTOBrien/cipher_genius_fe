<script setup></script>

<template>
  <div class="login-form">
    <input type="text" id="username" name="username" placeholder="username" />
    <br />
    <label for="username">Username</label>
    <br />
    <input type="password" id="password" name="password" placeholder="password" />
    <br />
    <label for="password">Password</label>
    <br />
    <button>Login</button>
    <p>Login or <RouterLink to="/register">create an account</RouterLink> to track your progress</p>
    <p>or <RouterLink to="/home">continue as guest</RouterLink>.</p>
  </div>
</template>

<style scoped>
input {
  margin: 15px 10px 5px 10px;
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

<script setup></script>

<template>
  <div class="login-form">
    <input type="text" />
    <br />
    <label>Username</label>
    <br />
    <input type="password" />
    <br />
    <label>Password</label>
    <br />
    <button>Login</button>
    <p>Login or <a href="CreateAccount">create an account</a> to track your progress</p>
    <p>or <a href="HomeView">countine as a guest</a>.</p>
  </div>
</template>

<style scoped>
input {
  margin: 10px;
}

button {
  margin: 10px;
  height:50px;
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

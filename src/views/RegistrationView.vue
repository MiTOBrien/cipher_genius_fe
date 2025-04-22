<script setup></script>

<template>
  <div class="login-form">
    <input type="text" id="username" name="username" placeholder="username" />
    <br />
    <label for="username">Username</label>
    <br />
    <input type="text" id="firstname" name="firstname" placeholder="first name - optional" />
    <br />
    <label for="firstname">First Name</label>
    <br />
    <input type="text" id="lastname" name="lastname" placeholder="last name - optional" />
    <br />
    <label for="lastname">Last Name</label>
    <br />
    <input type="email" id="email" name="email" placeholder="email address" />
    <br />
    <label for="email">Email Address</label>
    <br />
    <input type="password" id="password" name="password" placeholder="password" />
    <br />
    <label for="password">Password</label>
    <br />
    <input
      type="password"
      id="confirmpassword"
      name="confirmpassword"
      placeholder="confirm password"
    />
    <br />
    <label for="confirmpasswordfff">Confirm Password</label>
    <br />
    <button>Register</button>
    <p>Go to <RouterLink to="/">login page</RouterLink></p>
    <p>or <RouterLink to="/home">countine as a guest</RouterLink>.</p>
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

<template>
    <a class="navbar-brand" href="/">
  <div class="logo-empresa">
    <img src="/src/assets/img/logo-oficial.png" alt="logo-ofixial" width="150" height="auto" />
    <!--<span class="logo-1">Easy</span><span class="logo-2">Pantry</span>-->
  </div>
</a>
</template>

<style>
  .logo-empresa {
    font-weight: bold;
    text-align: center;
  }

  .logo-1 {
    color: #d0dbd4;
    margin-right: 7px;
  }

  .logo-2 {
    margin-left: 7px;
    color: #6ca033;
    position: relative;
  }

  .logo-1,
  .logo-2 {
    margin-top: -3px;
    display: inline-block;
    font-size: 34px;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.73));
  }

  /* .logo-2::before {
    content: "";
    position: absolute;
    top: 6px;
    margin-left: 5px;
    left: -14px;
    width: 5px;
    height: 80%;
    background-color: #2b5c18;
    z-index: 1;
    border-radius: 1rem;
  }*/

  @media screen and (max-width: 768px) {
    .logo-1,
    .logo-2 {
      margin-top: -3px;
      display: inline-block;
      font-size: 30px;
      filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.73));
    }
  }
</style>

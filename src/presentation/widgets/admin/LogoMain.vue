<a class="navbar-brand" href="/admin/dashboard">
  <div class="logo-empresa animate__animated animate__bounce">
    <span class="note">Oasis</span><span class="nest">Premiun</span>
  </div>
</a>

<style scoped>
  .logo-empresa {
    font-weight: bold;
    text-align: center;
  }

  .note {
    /**color: #d0dbd4;*/
    color: #d0dbd4;
    margin-right: 7px;
  }

  .nest {
    margin-left: 7px;
    color: #6ca033;
    position: relative;
  }

  .note,
  .nest {
    margin-top: -3px;
    display: inline-block;
    font-size: 30px;
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.73))
  }

  .nest::before {
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
  }

  @media screen and (max-width: 768px) {
  .note,
  .nest {
    margin-top: -3px;
    display: inline-block;
    font-size: 30px;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.73))
  }
  }
</style>

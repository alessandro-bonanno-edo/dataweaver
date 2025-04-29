<script lang="ts">
  import logo from "$lib/assets/svelte.svg";
  import {version} from "../../../package.json";
</script>

<footer>
  <b>DataWeaver {version}</b> - Made with <span>❤️</span> & <img src={logo} alt="svelte logo"> by Alessandro Bonanno - Uncharted Pod - Travel Things Area 
</footer>

<style>
  span, img {
    display: inline-block;
  }
  
  span, img {    
    margin-inline: .2rem;
  }
  
  b {    
    margin-inline-end: .2rem;
  }
  
  img {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
  }
</style>
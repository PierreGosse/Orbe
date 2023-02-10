<script lang="ts">
  import { KeyIndex } from "../cmps/keyIndex";

  KeyIndex.load(["toto est\tlien1", "tutu\tlien2"]);
  console.log(KeyIndex.getIndex());
  console.log(KeyIndex.parse('toto est bô!! c15 23'))
</script>

<div />

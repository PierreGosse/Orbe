<script lang="ts">
  import { KeyIndex } from "orbe-common";

  const keyIndex = new KeyIndex();
  keyIndex.load([
    { keys: ["toto", "est"], link: ["lien1"] },
    { keys: ["tutu"], link: ["lien2"] },
  ]);
  console.log(keyIndex.getIndex());
  console.log(keyIndex.parse("toto est bô!! c15 23"));
</script>

<div />

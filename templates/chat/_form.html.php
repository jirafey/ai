<?php
    /** @var $chat ?\App\Model\Chat */
?>

<div class="form-group">
    <label for="nick">Nick</label>
    <input type="text" id="nick" name="chat[nick]" value="<?= $chat ? $chat->getNick() : '' ?>">
</div>

<div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="chat[message]"><?= $chat? $chat->getMessage() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>

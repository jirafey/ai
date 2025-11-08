<?php

/** @var \App\Model\Chat $chat */
/** @var \App\Service\Router $router */

$title = 'Create Chat';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Chat</h1>
    <form action="<?= $router->generatePath('chat-create') ?>" method="POST" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="chat-create">
    </form>

    <a href="<?= $router->generatePath('chat-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

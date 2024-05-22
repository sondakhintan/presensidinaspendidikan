<?php
@$page = $_GET['q'];
if (!empty($page)) {
    switch ($page) {

        case '404':
            include './pages/404/404.php';
            break;
        case 'beranda':
            include './pages/beranda/beranda.php';
            break;
        case 'blog':
            include './pages/blog/blog.php';
            break;
        case 'contact':
            include './pages/contact/contact.php';
            break;
        case 'project':
            include './pages/project/project.php';
            break;
        case 'servis':
            include './pages/servis/servis.php';
            break;
        case 'team':
            include './pages/team/team.php';
            break;
        case 'testimonial':
            include './pages/testimonial/testimonial.php';
            break;
    }
} else {
    include './pages/beranda/beranda.php';
}

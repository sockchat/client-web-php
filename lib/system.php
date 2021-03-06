<?php

namespace sockchat;

function validateDefaults($spacks, $langs, $styles) {
    if(!in_array($GLOBALS["chat"]["DEFAULT_SPACK"], $spacks)) $GLOBALS["chat"]["DEFAULT_SPACK"] = $spacks[0];
    if(!in_array($GLOBALS["chat"]["DEFAULT_STYLE"], $styles)) $GLOBALS["chat"]["DEFAULT_STYLE"] = $styles[0];

    $found = false;
    foreach($langs as $lang) {
        if($lang[0] == $GLOBALS["chat"]["DEFAULT_LANG"]) {
            $found = true;
            break;
        }
    }
    if(!$found) $GLOBALS["chat"]["DEFAULT_LANG"] = $langs[0][0];
}

function validateCookies($spacks, $langs, $styles) {
    $pre = $GLOBALS["chat"]["COOKIE_PREFIX"];

    if(!isset($_COOKIE["{$pre}opts"])) setcookie("{$pre}opts", "{}", time() + 31536000);
    if(!isset($_COOKIE["{$pre}persist"])) setcookie("{$pre}persist", "{}", time() + 31536000);
    if(!isset($_COOKIE["{$pre}bbenable"])) setcookie("{$pre}bbenable", "{}", time() + 31536000);
    //if(!isset($_COOKIE["{$pre}soundpack"]) || !in_array($_COOKIE["{$pre}soundpack"], $spacks)) setcookie("{$pre}soundpack", $GLOBALS["chat"]["DEFAULT_SPACK"], time() + 31536000);
    if(!isset($_COOKIE["{$pre}style"]) || !in_array($_COOKIE["{$pre}style"], $styles)) setcookie("{$pre}style", $GLOBALS["chat"]["DEFAULT_STYLE"], time() + 31536000);

    $found = false;
    if(isset($_COOKIE["{$pre}lang"])) {
        foreach ($langs as $lang) {
            if ($lang[0] == $_COOKIE["{$pre}lang"]) {
                $found = true;
                break;
            }
        }
    }
    if(!$found) setcookie("{$pre}lang", $GLOBALS["chat"]["DEFAULT_LANG"], time() + 31536000); //$GLOBALS["chat"]["DEFAULT_LANG"] = $langs[0][0];
}

class StyleSheetHandler {
    public static function getAllStyles() {
        $styles = glob("./styles/*.css");

        $retval = [];
        foreach($styles as $style)
            array_push($retval, substr($style, strrpos($style, "/")+1, -4));
        sort($retval, SORT_NATURAL | SORT_FLAG_CASE);
        return $retval;
    }

    public static function getStyleMarkup($styles) {
        $retval = "";
        foreach($styles as $style) {
            if($style[0] != "_")
                $retval .= "<option value='$style' ". ($style == $GLOBALS["chat"]["DEFAULT_STYLE"] ? " selected='selected'" : "") .">$style</option>";
        }
        return $retval;
    }

    public static function getAlternateStyleMarkup($styles) {
        $retval = "";
        foreach($styles as $style) {
            if($style[0] != "_")
                $retval .= '<link href="./styles/'. $style .'.css" rel="alternate stylesheet" title="'. $style .'" type="text/css" />';
        }
        return $retval;
    }
}

class LanguagePackHandler {
    public static function getAllLanguagePacks() {
        $langs = glob("./lang/*", GLOB_ONLYDIR);

        $retval = [];
        foreach($langs as $lang) {
            if(file_exists($lang ."/common.json")) {
                $code = substr($lang, strrpos($lang, "/")+1);
                array_push($retval, [$code]);

                $files = glob($lang ."/*.json");
                foreach($files as $file)
                    array_push($retval[count($retval)-1], $file);
            }
        }
        return $retval;
    }

    public static function getLanguagePackString($packs) {
        $retval = [];
        foreach($packs as $lang)
            array_push($retval, "[\"". implode("\", \"", $lang) ."\"]");
        return implode(", ", $retval);
    }
}

class SoundPackHandler {
    private static $expectedFiles = ["chatbot","error","join","leave","receive","send"];

    public static function getAllSoundPacks() {
        $packs = [];

        foreach(glob("./sound/*", GLOB_ONLYDIR) as $dir) {
            $valid = true;
            foreach(SoundPackHandler::$expectedFiles as $file) {
                $test = array_merge(glob($dir ."/". $file .".mp3"), glob($dir ."/". $file .".ogg"));
                if(empty($test)) {
                    $valid = false;
                    break;
                }
            }
            if($valid) array_push($packs, substr($dir, strrpos($dir,"/")+1));
        }

        return $packs;
    }

    public static function getSoundPackString($packs) {
        return "\"". implode("\", \"", $packs) ."\"";
    }

    public static function getSoundPackMarkup($packs) {
        $retval = "";
        foreach($packs as $pack) {
            foreach(SoundPackHandler::$expectedFiles as $file) {
                $retval .= "<audio id='". $pack .".". $file ."'>";

                $fdata = glob("./sound/$pack/$file.*");
                foreach($fdata as $dfatas)
                    $retval .= "<source src='{$dfatas}?a=". filemtime($dfatas) ."' type='". finfo_file(finfo_open(FILEINFO_MIME_TYPE), $dfatas) ."' />";

                $retval .= "</audio>";
            }
        }
        return $retval;
    }
}
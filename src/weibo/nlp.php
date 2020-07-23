<?php
    # https://cloud.tencent.com/document/product/271/2053
    $sid="111";
    $skey="222";
    $now=time();
    $url='https://wenzhi.api.qcloud.com/v2/index.php?Action=LexicalAnalysis&Nonce=345122&Region=sz&SecretId=".$sid."&Timestamp=".$now."&Signature=HgIYOPcx5lN6gz8JsCFBNAWp2oQ&text=我爱洗澡&code=2097152';
    $signStr = base64_encode(hash_hmac('sha256', $url, $skey, true));
    echo $signStr;
?>

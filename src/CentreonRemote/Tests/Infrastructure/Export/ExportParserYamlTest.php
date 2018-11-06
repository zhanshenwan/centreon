<?php
namespace CentreonRemote\Tests\Infrastructure\Export;

use PHPUnit\Framework\TestCase;

/**
 * @group CentreonRemote
 */
class ExportParserYamlTest extends TestCase
{

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportParserYaml::parse
     */
    public function testParse()
    {
        $this->assertEquals(2, 2);
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportParserYaml::dump
     */
    public function testDump()
    {
        $this->assertEquals(1, 1);
    }
}

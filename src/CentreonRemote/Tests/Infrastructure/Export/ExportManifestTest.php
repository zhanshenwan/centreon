<?php
namespace CentreonRemote\Tests\Infrastructure\Export;

use PHPUnit\Framework\TestCase;
use CentreonRemote\Infrastructure\Export\ExportParserYaml;
use CentreonRemote\Infrastructure\Export\ExportCommitment;
use CentreonRemote\Infrastructure\Export\ExportManifest;

/**
 * @group CentreonRemote
 */
class ExportManifestTest extends TestCase
{

    protected $manifest;
    protected $version = '18.10';

    protected function setUp()
    {
//        $parser = $this->getMockBuilder(ExportParserYaml::class)
//            ->getMock()
//        ;
//
//        $parser->expects($this->once())
//            ->method('parse')
//            ->with()
//        ;
        $parser = new ExportParserYaml;

        $commitment = new ExportCommitment(null, null, null, $parser);

        $this->manifest = new ExportManifest($commitment, $this->version);
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportManifest::addExporter
     */
    public function testAddExporter()
    {
        $value = 'TestExporter';
        $this->manifest->addExporter($value);

        $this->assertAttributeEquals([$value], 'exporters', $this->manifest);
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportManifest::addFile
     */
    public function testAddFile()
    {
        $this->manifest->addFile('missing-file.txt');

        $this->assertAttributeEquals(null, 'files', $this->manifest);

//        $this->manifest->addFile(__FILE__);
//
//        $this->assertAttributeEquals([__FILE__], 'files', $this->manifest);
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportManifest::get
     */
    public function testGet()
    {
        $this->assertNull($this->manifest->get('missing-data'));
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportManifest::validate
     * @expectedException \Exception
     */
    public function testValidate()
    {
        $this->manifest->validate();
    }

    /**
     * @covers \CentreonRemote\Infrastructure\Export\ExportManifest::dump
     */
    public function testDump()
    {
//        $this->assertEquals(1, $this->manifest->dump());
    }
}

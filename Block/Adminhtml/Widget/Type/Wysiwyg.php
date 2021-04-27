<?php

namespace Dmatthew\WidgetParameters\Block\Adminhtml\Widget\Type;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Helper\SecureHtmlRenderer;

Class Wysiwyg extends \Magento\Backend\Block\Template
{
    const TEXT_AREA_ID = 'widget_param_wysiwyg_element';

    /**
     * @var \Magento\Cms\Model\Wysiwyg\Config
     */
    protected $wysiwygConfig;

    /**
     * @var \Magento\Framework\Data\Form\Element\Factory
     */
    protected $factoryElement;

    /**
     * @var SecureHtmlRenderer
     */
    protected $secureRenderer;

    protected $editorId;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Data\Form\Element\Factory $factoryElement
     * @param \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Data\Form\Element\Factory $factoryElement,
        \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig,
        $data = []
    ) {
        $this->factoryElement = $factoryElement;
        $this->wysiwygConfig = $wysiwygConfig;
        $this->secureRenderer = ObjectManager::getInstance()->get(SecureHtmlRenderer::class);
        parent::__construct($context, $data);
    }

    /**
     * Prepare chooser element HTML
     *
     * @param \Magento\Framework\Data\Form\Element\AbstractElement $element Form Element
     * @return \Magento\Framework\Data\Form\Element\AbstractElement
     */
    public function prepareElementHtml(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $this->editorId = rand(10000, 99999);
        $editor = $this->factoryElement->create('editor', ['data' => str_replace('"', "'", $element->getData())])
            ->setId(self::TEXT_AREA_ID.'_'.$this->editorId)
            //->setClass("widget-option input-textarea admin__control-text")
            ->setLabel('')
            ->setForm($element->getForm())
            ->setWysiwyg(true)
            ->setConfig(
                $this->wysiwygConfig->getConfig([
                    'add_variables' => false,
                    'add_widgets' => false,
                    'add_images' => false
                ])
            );

        if ($element->getRequired()) {
            $editor->addClass('required-entry');
        }

        $element->setData('after_element_html', $editor->getElementHtml() . $this->addAfterHtmlJs());
        $element->setValue(''); // Hides the additional label that gets added.

        return $element;
    }

    public function addAfterHtmlJs()
    {
        $scriptString = <<<HTML
            require([
                'jquery',
                //'mage/adminhtml/wysiwyg/tiny_mce/setup',
                'Dmatthew_WidgetParameters/js/tinymce4WidgetsSetup'
            ], function(jQuery){
                var wysiwygwidget_param_{$this->editorId} = new wysiwygWidgetsSetup('{$this->getHtmlId()}_{$this->editorId}', {
                        "isInWidget": true,
                        "width":"100%",  // defined width of editor
                        "height":"200px", // height of editor
                        "plugins":[], // for image
                        "tinymce4":{"toolbar":"formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table charmap","plugins":"advlist autolink lists link charmap media noneditable table contextmenu paste code help table",
                     }
                 });
                 
                 wysiwygwidget_param_{$this->editorId}.setup("exact");
            });
        HTML;
        return $this->secureRenderer->renderTag('script', [], $scriptString, false);
    }

    public function getHtmlId()
    {
        return self::TEXT_AREA_ID;
    }
}
